import { Schema, model } from "mongoose";
import mongoose from "mongoose";

const userSchema = new Schema({
    first_name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    age: {
        type: Number,
        required: true,
        default: 0,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: "user",
    },
    cart: {
        type: Schema.Types.ObjectId,
        ref: "carts",
    },

});

mongoose.set("strictQuery", false);
export const userModel = model("User", userSchema);

