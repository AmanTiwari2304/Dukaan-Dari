import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(cors({
    origin : process.env.CORS_ORIGIN,
    credentials : true
}))

app.use(express.json({limit:"16kb"})) // to limit the file capacity
app.use(express.urlencoded({extended :true, limit : "16kb"})) // to understand the url from the browser
app.use(express.static("public")) // to access the content of public file 
app.use(cookieParser()) // to store some data from cookies 

import userRouter from "./routes/user.route.js"
import productRouter from "./routes/product.route.js"

app.use("/api/v1/users", userRouter)
app.use("/api/v1/products", productRouter)

// Global Error Handler Middleware
app.use((err, req, res, next) => {
    console.error("[Global Error Handler]", {
        message: err.message,
        statusCode: err.statusCode || 500,
        timestamp: new Date().toISOString()
    });

    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    return res
        .status(statusCode)
        .json({
            success: false,
            message: message,
            statusCode: statusCode
        });
});

export {app}