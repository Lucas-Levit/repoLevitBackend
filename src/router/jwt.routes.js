import { Router } from "express";
import { userModel } from "../models/User.js";
import { compareData, generateToken } from "../utils/bcrypt.js";
import { jwtValidation } from "../middlewares/jwt.middleware.js";

const router = Router()

router.post('/login' , async(req,res) =>{
    const {email, password} = req.body
    const userBD = await userModel.findOne({email})
    if (!userBD) {
        return res.status(401).send('User not found')
    }
    const isPassword = await compareData(password, userBD.password)
    if (!password){
        return res.status(401).send('Error en el mail o la contraseña')
    }
const token = generateToken(userBD)
res.status(200).json({message:'login', token})
})

router.get('/validation', jwtValidation, (req,res) =>{
    const {email} = req.user
    res.send(`Probando ${email}`)
}
)


export default router