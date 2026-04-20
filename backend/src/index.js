import { app } from "./app.js";
import connectDB from "./db_config/connection.js";
import dotenv from "dotenv"


dotenv.config({path :'./.env'})

connectDB()
.then(() => {
    app.listen(process.env.PORT || 8080, () => {
        console.log(`Server is listening on port ${process.env.PORT}`)
    })
})
.catch((err) =>{
    console.log("Error in connection", err);
})