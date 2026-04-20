import dotenv from "dotenv";
import connectDB from "../src/db_config/connection.js";
import { User } from "../src/models/user.model.js";

dotenv.config();
connectDB();

const createOwner = async () => {
    const existingOwner = await User.findOne({ role: "owner" });

    if (existingOwner) {
        console.log("Owner already exists");
        process.exit(0);
    }

    await User.create({
        name: "Dinesh Kumar Tiwari",
        phone: process.env.PHONE_NUMBER,
        email : process.env.EMAIL_ADDRESS,
        password: process.env.SHOP_LOGIN_PASSWORD,
        role: "owner",
        shopName: "Ram Charitra Tiwari General Store",
        address: "Sahaspur Patti Pratapgarh U.P",
    });

    console.log("Owner created successfully");
    process.exit(0);
};

createOwner();