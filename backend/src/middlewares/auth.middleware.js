import { ApiError } from "../utils/apiErrors.js";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"


export const verifyJWT = asyncHandler (async (req , res, next) => {
    try{
        const token = req.cookies?.accessToken || 
                        req.header("Authorization")?.replace("Bearer", "");

                    
        if(!token){
            throw new ApiError(400, "Unable to get token from cookies");
        }

        const decodedToken =  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        const user = await User.findById(decodedToken._id).select("-password, -refreshToken");

        if(!user){
            throw new ApiError(400, "User not found");
        }

        req.user = user
        next()
 
    } 
    catch (error) {
        throw new ApiError(400, "Error in verifying token")
    }
})

export const ownerOnly = (req, res, next) => {
    if (req.user?.role !== "owner") {
        return res.status(403).json({ message: "Owner access only" });
    }
    next();
};

export const retailerOnly = (req, res, next) => {
    if (req.user?.role !== "retailer") {
        return res.status(403).json({ message: "Retailer access only" });
    }
    next();
};