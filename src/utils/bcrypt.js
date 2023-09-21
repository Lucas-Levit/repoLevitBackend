import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken'
import config from "../config/config.js";


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