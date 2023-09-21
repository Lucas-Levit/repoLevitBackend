import { usersService } from "../services/users.service.js";

class UsersController {
    async findAllUsers(req, res) {
        try {
            const allUser = await usersService.findAllUsers()
            res.status(200).json({ message: "Users", allUser })
        } catch (error) {
            res.status(500).json({ message: "Error", error })
        }
    }

    async findOneUser(req, res) {
        const { idUser } = req.params;
        try {
            const user = await usersService.findOneUser(idUser); 
            res.status(200).json({ message: "User", user });
        } catch (error) {
            res.status(500).json({ message: "Error", error });
        }
    }


    async createOneUser(req, res) {
        const { first_name, last_name, email, password } = req.body;
        if (!first_name || !last_name || !email || !password) {
            res.status(401).json({ message: "Faltan algunos datos" });
            return; 
        }
        try {
            const newUser = await usersService.createOneUser({
                first_name,
                last_name,
                email,
                password,
            }); // Pasar el objeto con los datos del usuario al servicio
            res.status(200).json({ message: "Usuario creado", user: newUser });
        } catch (error) {
            res.status(500).json({ message: "Error", error });
        }
    }

    async deleteOne(req, res) {
        const { idUser } = req.params
        try {
            const user = await usersService.deleteOneUser(idUser)
            res.redirect("/api/users/useredit")
        } catch (error) {
            res.status(500).json({ message: "Error", error })
        }
    }

    async editUsers (req, res) {
        
        try {
            const users = await usersService.findAllUsers()
            res.status(200).render('adminUser', {users: users});
        } catch (error) {
            res.status(500).json({ message: "Error", error })
        }
    }
    
    async changePremiumRole (req, res) {
        try {
            const id = req.params.id
            const updateOneUser = await usersService.changePremiumRole(id)
            res.redirect("/api/users/useredit")
        } catch (error) {
            res.status(500).json({ message: "Error", error })
        }
    }
    
}

export const usersController = new UsersController()