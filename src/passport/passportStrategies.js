import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GithubStrategy } from "passport-github2";
import { userModel } from "../DAL/mongoDB/models/User.js";
import { compareData, hashData } from "../utils/bcrypt.js";

// Estrategia passport-local (registro)
passport.use(
    "register",
    new LocalStrategy(
        { usernameField: "email", passReqToCallback: true },
        async (req, email, password, done) => {
            try {
                const register = req.body;
                const hashPassword = await hashData(register.password);
                const userNew = { ...req.body, password: hashPassword };
                const user = new userModel(userNew);
                await user.save();
                return done(null, user);
            } catch (error) {
                if (error.name === "MongoServerError" && error.code === 11000) {
                    // Error de email duplicado
                    return done(null, false, { message: "El email ya existe." });
                }
                done(error);
            }
        }
    )
);

// Estrategia passport-local (inicio de sesión)
passport.use(
    "login",
    new LocalStrategy(
        { usernameField: "email", passReqToCallback: true },
        async (req, email, password, done) => {
            try {
                const user = await userModel.findOne({ email }).lean().exec();
                if (!user) {
                    return done(null, false);
                }
                const isPasswordValid = await compareData(password, user.password);
                if (!isPasswordValid) {
                    return done(null, false);
                }
                console.log(user)
                done(null, user);
            } catch (error) {
                done(error);
            }
        }
    )
);

// Estrategia passport-github2
passport.use(
    "githubSignUp",
    new GithubStrategy(
        {
            clientID: "Iv1.570235c63413e78f",
            clientSecret: "b1a59dfd337e53cf3e2b2ffb5d106e89fad60d38",
            callbackURL: "http://localhost:4000/sessions/github",
        },
        async (accesToken, refreshToken, profile, done) => {
            const { name, email, id, login } = profile._json;
            try {
                if (email === null) {
                    const userBD = await userModel.findOne({ email: id.toString() + "@gmail.com" })
                    if (userBD) {
                        return done(null, userBD)
                    }
                    else {
                        const hashPassword = await hashData("123");
                        const user = {
                            first_name: login,
                            last_name: " ",
                            email: id.toString() + "@gmail.com",
                            password: hashPassword
                        }
                        const newUserBD = await userModel.create(user)
                        return done(null, newUserBD)
                    }
                }
                else {
                    const user = {
                        first_name: name.split(" ")[0] || login,
                        last_name: name.split(" ")[1] || " ",
                        email: email,
                        password: "123",
                    };
                    const newUserDB = await userModel.create(user);
                    done(null, newUserDB);
                }
            } catch (error) {
                done(error);
            }
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await userModel.findById(id);
        done(null, user);
    } catch (error) {
        done(error);
    }
});

export default passport;
