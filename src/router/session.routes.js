import { Router } from "express";
import { userModel } from "../models/User.js";

const router = Router()

router.get("/register", (req, res) => {
    res.render("sessions/register")
})

router.post("/register", async (req, res) => {
    const userNew = req.body
    const user = new userModel(userNew)
    await user.save()
    res.redirect("/sessions/login")
})

router.get("/login", (req, res) => {
    res.render("sessions/login")
})

router.post("/login", async (req, res) => {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email, password }).lean().exec();
        if (!user) {
            return res.status(401).render("errors/base", {
                error: "Error en mail y/o contraseña",
            });
        }
        // req.session.user = user;
        res.redirect("/api/products");
    });

router.get("/logout", (req, res) => {
    req.session.destroy(err => {
        if (err) res.status(500).render("errors/base", {
            error: err
        })
        else res.redirect("/sessions/login")
    })
})

export default router
