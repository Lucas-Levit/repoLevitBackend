import { fileURLToPath } from "url";
import { dirname } from "path";

export const __filename = fileURLToPath (import.meta.url)
export const __dirname = dirname(__filename)

// export const generateToken = (user) =>{
//     const token = jwt.sign({user}, process.env.SECRET_KEY_JWT , {expireIn: '1h'})
//     return token
// }