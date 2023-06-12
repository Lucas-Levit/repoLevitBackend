import bcrypt from "bcrypt";

// encriptar una contraseña
export const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(parseInt(process.env.SALT)))

console.log(createHash("coderhouse"));

// devolver un logico (V o F) si la contraseña enviada es igual a la BDD 
export const validatePassword = (passwordSend, passwordBDD ) => bcrypt.compareSync(passwordSend, passwordBDD)

const passwordEncriptado = createHash("coderhouse")
console.log(passwordEncriptado);
console.log(validatePassword("coderhouse", passwordEncriptado));