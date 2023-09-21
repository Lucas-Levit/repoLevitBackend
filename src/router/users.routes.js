import { Router } from "express";
import { usersController } from "../controllers/users.controller.js";
import EErrors from "../services/errors/enum.js";
import CustomError from "../services/errors/CustomError.js";
import { generateUserErrorInfo } from "../services/errors/info.js";
import { generateUser } from '../utils/utilis.js'
import nodemailer from "nodemailer";
import config from "../config/config.js";


const router = Router();

router.get("/useredit" , usersController.editUsers )
router.get("/:idUser", usersController.findOneUser);

let users = []

router.post("/", (req, res) => {
    const { first_name, last_name, age, email } = req.body;
    if (!first_name || !last_name || !email || !age) {
        const error = CustomError.createError({
            name: "User creation error",
            cause: generateUserErrorInfo({ first_name, last_name, age, email }),
            message: "Error al intentar crear el usuario",
            code: EErrors.INVALID_TYPES_ERROR,
        });
        return errorHandler(error, req, res);
    }
    const user = {
        first_name: first_name,
        last_name: last_name,
        age: age,
        email: email,
    };
    console.log(user);

    if (users.length === 0) {
        user.id = 1;
    } else {
        user.id = users[users.length - 1].id + 1;
    }
    users.push(user);
    res.send({ status: "success", payload: user });
});

router.get('/', async (req, res) => {
    const users = []
    for (let i = 0; i < 100; i++) {
        users.push(generateUser())
    }
    console.log(users)
    res.json({ status: 'success', payload: users })
})


const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: config.gmail_user,
        pass: config.gmail_password,
    },
    tls: {
        rejectUnauthorized: false,
    },
});

// Función para enviar un correo de notificación
const sendNotificationEmail = async (email) => {
    try {
        await transporter.sendMail({
            to: email,
            subject: "Eliminación de cuenta por inactividad",
            text: "Tu cuenta ha sido eliminada debido a la inactividad en los últimos 2 días.",
        });
        console.log(`Correo de notificación enviado a ${email}`);
    } catch (error) {
        console.error(`Error al enviar correo de notificación a ${email}:`, error);
    }
};
router.delete("/", (req, res) => {
    try {
        const twoDaysAgo = new Date();
        twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

        // Filtra y obtén la lista de usuarios inactivos en los últimos 2 días
        const inactiveUsers = users.filter((user) => new Date(user.lastConnection) < twoDaysAgo);

        // Elimina a los usuarios inactivos de la lista de usuarios
        users = users.filter((user) => new Date(user.lastConnection) >= twoDaysAgo);

        // Envía correos electrónicos de notificación a los usuarios inactivos eliminados
        inactiveUsers.forEach((user) => {
            sendNotificationEmail(user.email);
        });

        res.json({ status: "success", message: "Usuarios inactivos eliminados y notificados" });
    } catch (error) {
        console.error("Error al eliminar usuarios inactivos:", error);
        res.status(500).json({ status: "error", message: "Error al eliminar usuarios inactivos" });
    }
});


router.get("/:id/update-role" , usersController.changePremiumRole)
router.get("/:idUser/delete" , usersController.deleteOne)

export default router;
