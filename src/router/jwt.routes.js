import { Router } from "express";
import { userModel } from "../DAL/mongoDB/models/User.js";
import { compareData, generateToken } from "../utils/bcrypt.js";
import { jwtValidation } from "../middlewares/jwt.middleware.js";
import jwt from "jsonwebtoken";

const router = Router()


router.get('/validation', jwtValidation, (req, res) => {
    const { email } = req.user
    res.send(`Probando ${email}`)
})

export default router