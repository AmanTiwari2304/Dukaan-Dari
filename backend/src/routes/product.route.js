import { Router } from "express";
import { verifyJWT, ownerOnly } from "../middlewares/auth.middleware.js";
import { upload }  from "../middlewares/multer.middleware.js";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  getProducts,
  getSingleProduct,
} from "../controllers/product.controller.js";

const router = Router();

router.post("/createProduct", 
  verifyJWT, 
  ownerOnly, 
  upload.single("imageURL"),
  // upload.fields([{ name: "imageFile", maxCount: 1 }]), 
createProduct);

router.get("/", verifyJWT, getProducts);
router.get("/:id", verifyJWT, getSingleProduct);
router.put("/:id", verifyJWT, ownerOnly, updateProduct);
router.delete("/:id", verifyJWT, ownerOnly, deleteProduct);

export default router;