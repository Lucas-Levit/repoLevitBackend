import local from "passport-local";
import passport from "passport";

import { createHash, validatePassword } from "../utils/bcrypt.js";

const LocalStrategy = local.Strategy

const inicializePassword = () => {
    passport.use("register", new LocalStrategy)(
    {passReqCallback: true, usernameField: "email"}, async (req,userName, password, done))

    passport.use("login" , new LocalStrategy)
}