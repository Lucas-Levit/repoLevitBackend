import mongoose from "mongoose";
import config from "./config.js"


mongoose
    .connect(config.url_mongodb_atlas, {
        dbName: "ecommerce",
    })
    .then(() => {
        console.log("DB is connected");
    })
    .catch((error) => console.log("Error en MongoDB Atlas :", error));
