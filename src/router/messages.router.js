import { Router } from "express";
import { transporter ,sendMail } from "../utils/nodemailer.js";


const router = Router();
let messages = [];
router.get("/", async (req, res) => {
    try {
        res.render('chat', {})
        await sendMail(
            "lucassebas96@gmail.com",
            "Ticket de compra",
            "Probando primer Email",
        );

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});


router.post('/', async (req, res) => {
    try {
        const message = req.body.message;
        messages.push(message);  // Guardar el mensaje

        // Enviar el correo
        await transporter.sendMail({
            to: 'lucassebas96@gmail.com',
            subject: 'Nuevo Mensaje',
            text: message,
        });

        res.status(200).json({ status: 'Mensaje enviado y guardado' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});



export default router;
