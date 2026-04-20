import { ApiError } from "../utils/apiErrors.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Product } from "../models/product.model.js";
import { ApiResponse } from "../utils/apiResponse.js";


const createProduct = asyncHandler(async (req, res) => {
    const {
        name, brandName, unit,  
        minQty, maxQty, stockAlertNumber, 
    } = req.body

    let packsizes = JSON.parse(req.body.packsizes);

    if([name, brandName, unit]
        .some((field) => !field || (typeof field === 'string' && field.trim() === ""))){
        throw new ApiError(400, "Please provide all the details to create new product")
    }

    if(!packsizes || !Array.isArray(packsizes) || packsizes.length === 0){
        throw new ApiError(400, "Please provide at least a packsize");
    }

    for(let packsize of packsizes){
        if(!packsize.size || !packsize.price || !packsize.stock){
            throw new ApiError(400, "Please provide packsize details")
        }
        if(packsize.price <= 0 || packsize.stock < 0){
            throw new ApiError(400, "Price and stock must be positive")
        }
    }
   
    const imageURL = req.file?.path;

    if(!imageURL){
        throw new ApiError(400, "Please provide valid image");
    }

    const uploadedImage = await uploadOnCloudinary(imageURL);

    if(!uploadedImage){
        throw new ApiError(400, "Unable to upload image")
    }

    const product = await Product.create({
        name, brandName, unit,  minQty, 
        maxQty, stockAlertNumber,packsizes,
        imageURL : uploadedImage?.url,
    })

    if(!product){
        throw new ApiError(400, "Unable to create new product");
    }

    return res
    .status(200)
    .json(new ApiResponse(200, {product}, "Successfully created new product"))

})

const getProducts = asyncHandler(async (req, res) => {

})



const getSingleProduct = asyncHandler(async (req, res) => {

})


const updateProduct = asyncHandler(async (req, res) => {

})

const deleteProduct = asyncHandler(async (req, res) => {
    
})

export {
    createProduct,
    updateProduct,
    deleteProduct,
    getProducts,
    getSingleProduct

}