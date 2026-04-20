import { ApiError } from "../utils/apiErrors.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/apiResponse.js";


const userRegister = asyncHandler(async (req, res) => {
    const {name, email, password, phone, shopName, address, role } = req.body

    if([name, email, password, phone, address, role].some((field) => field?.trim() === "")){
        throw new ApiError(400, "Please provide all the required input")
    }

    const existedUser = await User.findOne({
        $or : [{email} , {phone}]
    });

    if(existedUser){
        throw new ApiError(400, "User already registered");
    }

    if(role == "owner"){
        throw new ApiError(400, "You have not the access of owner")
    }

    const user = await User.create({
        name : name,
        email : email,
        phone : phone,
        password,
        role,
        shopName,
        address
    })

    const newUser = await User.findById(user?._id).select("-password -refreshToken");

    if(!newUser){
        throw new ApiError(500 , "Unable to create user")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, {newUser},  "Successfully created user"))
})

const generateRefreshAndAccessTokens = async (userId) => {
    try {
        if(!userId){
            throw new ApiError(400, "Please provide user id to generate tokens")
        }
        
        const user = await User.findById(userId);

        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave : false});

        return {accessToken, refreshToken}

    } catch (error) {
        throw new ApiError(400, "Unable to generate tokens")
    }
}

const userLogin = asyncHandler(async (req, res) => {
    const {email, password, phone} = req.body

    if(!phone && !email){
        throw new ApiError(400, "Provide phone number or email")
    }

    if(!password || password.trim() === ""){
        throw new ApiError(400, "Please give valid password")
    }

    const user = await User.findOne({
        $or:  [{phone}, {email}]
    });

    if(!user){
        throw new ApiError(400, "User do not exist, Please enter valid user details")
    }

    const isValidPassword = await user.isPasswordCorrect(password);

    if(!isValidPassword){
        throw new ApiError(400, "Wrong password")
    }

    const {accessToken, refreshToken} = await generateRefreshAndAccessTokens(user._id);

    const loggedInUser = await User.findById(user._id).select("-password");

    // Using cookies
    const options = {
        httpOnly : true,
        secure : true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(
        200,
        {
            loggedInUser, accessToken, refreshToken
        },
        "Successfully logged in user"
    ))
})

const userLogout = asyncHandler(async(req, res) => {
    await User.findByIdAndUpdate(
        req.user?._id,
        {
            $unset : {
                refreshToken : 1
            }
        },
        {
            new : true
        }

    )

    const options = {
        httpOnly : true,
        secure : true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "Successfully logout user"))
})

const changePassword = asyncHandler(async(req, res) => {
    const {prevPassword, newPassword} = req.body;
    const userId = req.user?._id;

    if(!prevPassword.trim() || !newPassword.trim()){
        throw new ApiError(400, "Please enter credentials to change password")
    }

    const user = await User.findById(userId);

    const isValidPassword = await user.isPasswordCorrect(prevPassword);

    if(!isValidPassword){
        throw new ApiError(400, "Please enter correct previous password")
    }

    user.password = newPassword;
    await user.save({validateBeforeSave: false});

    const {accessToken, refreshToken} = await generateRefreshAndAccessTokens(userId);

    const userDetails = await User.findById(userId).select("-password -refreshToken");

    const options = {
        httpOnly : true,
        secure : true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, {userDetails}, "Successfully change password"))
})

export {
    userRegister,
    userLogin,
    userLogout,
    changePassword
}