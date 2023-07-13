import { Router } from "express";
import { hashData, compareData } from "../utils/bcrypt.js";
import passport from "passport";
import { userModel } from "../DAL/mongoDB/models/User.js";
import { usersService } from "../services/users.service.js";

const sessionRouter = Router();

//vista para registrar usuarios
sessionRouter.get("/register", (req, res) => {
    res.render("sessions/register");
});
// sessionRouter.post("/register", async (req, res) => {
//     try {
//         const register = req.body;
//         const hashPassword = await hashData(register.password);
//         const userNew = { ...req.body, password: hashPassword };
//         const user = new userModel(userNew);
//         await user.save();
//         res.redirect("/sessions/login");
//     } catch (err) {
//         console.error(err);
//         res.status(500).send("Email registrado. Ingrese uno nuevo");
//     }
// });

sessionRouter.post(
    "/register",
    passport.authenticate("register", {
        failureRedirect: "/api/products/errorLogin",
        successRedirect: "/sessions/login",

    })
);
//Vista de login
sessionRouter.get("/login", (req, res) => {
    res.render("sessions/login");
});
// sessionRouter.post("/login", async (req, res) => {
//     const { email, password } = req.body;
//     const user = await userModel.findOne({ email, password }).lean().exec();
//     if (!user) {
//         return res.status(401).render("errors/base", {
//             error: "Error en mail y/o contraseña",
//         });
//     }

//     // req.session.user = user;
//     res.redirect("/api/products");
// });

sessionRouter.post(
    "/login",
    passport.authenticate("login", {
        failureRedirect: "/api/products/errorLogin",
        successRedirect: "/api/products",
    })
);

sessionRouter.get(
    "/githubSignUp",
    passport.authenticate("githubSignUp", { scope: ["user:email"] })
);
sessionRouter.get(
    "/github",
    passport.authenticate("githubSignUp", {
        failureRedirect: "/api/products/errorLogin",
    }),
    function (req, res) {
        res.redirect("/api/products");
    }
);


sessionRouter.get("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err)
            res.status(500).render("errors/base", {
                error: err,
            });
        else res.redirect("/sessions/login");
    });
});
export default sessionRouter;