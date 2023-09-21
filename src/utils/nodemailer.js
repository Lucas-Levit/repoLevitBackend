import nodemailer from "nodemailer"
import config from "../config/config.js"

export const transporter  = nodemailer.createTransport({

service: "gmail",

auth: {
user: config.gmail_user,
pass: config.gmail_password,
},
tls: {
rejectUnauthorized: false 
}
})

export const sendMail = async  (email, asunto, texto) => {  await transporter.sendMail({
    to: email,
    subject: asunto,
    text: texto,
})} ;