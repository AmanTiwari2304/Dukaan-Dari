import { Router } from "express";
import { 
    userLogin, 
    userRegister,
    changePassword 
} from "../controllers/user.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router();


router.route("/register").post(userRegister)
router.route("/login").post(userLogin)
router.route("/updatePassword").post(verifyJWT, changePassword)


export default router