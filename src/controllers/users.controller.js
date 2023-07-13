import { usersService } from "../services/users.service.js";

class UsersController {
    async findAllUsers(req, res){
        try {
            const allUser = await usersService.findAllUsers()
            res.status (200).json({message: "Users",allUser})
        } catch (error) {
            res.status(500).json({message: "Error",error})
        }
    }

    async findOneUser(req,res){
        const {idUser} = req.params
        try {
            const user = await usersService.findOneUser(id)
            req.status(200).json({message:"User", user})
        } catch (error) {
            res.status(500).json({message:"Error", error})
        }
    }

    async createOneUser(req,res){
        const {first_name, last_name, email, password} = req.body
        if (!first_name || !last_name || !email || !password) {
            res.status(401).json({message:"Faltan algunos datos"})
        }
        try {
            const newUser = await usersService.createOneUser(req,user)
            res.status(200).json({message:"Usuario creado", user: newUser})
        } catch (error) {
            res.status(500).json({message: "Error", error})
        }
    }

    async deleteOne(req,res){
        const {idUser} = req.params
        try {
            const user = await usersService.deleteOneUser(idUser)
            res.status(200).json({message:"Usuario borrado", user})
        } catch (error) {
            res.status(500).json({message: "Error", error})
        }
    }
}

export const usersController = new UsersController()