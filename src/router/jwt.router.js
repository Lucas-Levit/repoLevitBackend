// import { Router } from "express";
// import { userModel } from "../models/User";
// import { compareData } from "../utils/bcrypt";

// const router = Router()


// router.post('/login' , async(req,res) =>{
//     const {email, password} = req.body
//     const userBD = await usersModel.findOne({email})
//     if (!userBD) {
//         return res.status(400).send('User not found')
//     }
//     const isPassword = await compareData(password, userBD.password)
//     if (!password){
//         return res.status(401).send('Error en el mail o la contraseña')
//     }
// const token = generateToken(userBD)
// res.status(200).json({message:'login', token})
// })


// router.get('/validation')

// export default router