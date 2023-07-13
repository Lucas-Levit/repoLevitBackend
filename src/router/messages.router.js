import {Router} from "express"
import { transporter } from "../utils/nodemailer.js";

const router = Router()

router.get("./" , async (req,res)=>{
    try {
        await transporter.sendMail({
            to: "lucassebas96@gmail.com",
            subject: "Correo Coderhouse",
            text: "Probando primer Email",
        })



        res.status(200).send("Mail sent")


    } catch (error) {
        res.status(500).json({message: error})
    }
} )






export default router