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