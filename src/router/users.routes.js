import { Router } from "express";
import { usersController } from "../controllers/users.controller.js";
import EErrors from "../services/errors/enum.js";
import CustomError from "../services/errors/CustomError.js";
import { generateUserErrorInfo } from "../services/errors/info.js";
import { generateUser } from '../utils/utilis.js'


const router = Router();

// router.get("/", usersController.findAllUsers);
router.get("/:idUser", usersController.findOneUser);
// router.post("/", usersController.createOneUser);
// router.delete("/:idUser", usersController.deleteOne);


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

router.get('/', async (req,res)=>{
    const users=[]
    for(let i=0; i<100; i++){
        users.push(generateUser())
    }
    console.log(users)
    res.json({status :'success',payload:users})
})

router.delete("/:idUser", usersController.deleteOne);

export default router;
