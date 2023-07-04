import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken'
import config from "./config.js";


// encriptar una contraseña
// export const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(parseInt(process.env.SALT)))

// console.log(createHash("coderhouse"));

// devolver un logico (V o F) si la contraseña enviada es igual a la BDD 
// export const validatePassword = (passwordSend, passwordBDD) => bcrypt.compareSync(passwordSend, passwordBDD)

// const passwordEncriptado = createHash("coderhouse")
// console.log(passwordEncriptado);
// console.log(validatePassword("coderhouse", passwordEncriptado));

export const hashData = async (data) => {
    return bcrypt.hash(data, 10);
};
export const compareData = async (data, hashData) => {
    return bcrypt.compare(data, hashData);
};

export const generateToken = (user) => {
    const token = jwt.sign({ user }, config.secret_key_jwt, { expiresIn: '1h' })
    return token
}