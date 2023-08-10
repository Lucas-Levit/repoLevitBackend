import { Router } from "express";
import { userModel } from "../DAL/mongoDB/models/User.js";
import { compareData, generateToken } from "../utils/bcrypt.js";
import { jwtValidation } from "../middlewares/jwt.middleware.js";
import jwt from "jsonwebtoken";

const router = Router()

router.post('/login', async (req, res) => {
    const { email, password } = req.body
    const userBD = await userModel.findOne({ email })
    if (!userBD) {
        return res.status(401).send('User not found')
    }
    const isPassword = await compareData(password, userBD.password)
    if (!password) {
        return res.status(401).send('Error en el mail o la contraseña')
    }
    const token = generateToken(userBD)
    res.status(200).json({ message: 'login', token })
})

router.get('/validation', jwtValidation, (req, res) => {
    const { email } = req.user
    res.send(`Probando ${email}`)
})

router.post("/forgot-password", async (req, res) => {
    const { email } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
    }
    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY_JWT, { expiresIn: "1h" });
    // Aquí debes enviar el correo electrónico con el enlace de restablecimiento que contiene el token
    res.json({ message: "Se ha enviado un enlace de restablecimiento a tu correo electrónico" });
});

router.get("/reset-password/:token", (req, res) => {
    const { token } = req.params;
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY_JWT);
        res.render("reset-password", { token });
    } catch (error) {
        res.status(400).json({ message: "El enlace es inválido o ha expirado" });
    }
});

router.post("/reset-password/:token", async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY_JWT);
        const user = await userModel.findById(decoded.userId);
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        // Aquí debes actualizar la contraseña del usuario en la base de datos con la nueva contraseña
        res.json({ message: "Contraseña restablecida exitosamente" });
    } catch (error) {
        res.status(400).json({ message: "El enlace es inválido o ha expirado" });
    }
});


export default router