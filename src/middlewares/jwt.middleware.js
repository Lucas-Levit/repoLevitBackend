import jwt from "jsonwebtoken";

export const jwtValidation = (req, res, next) => {
    const authorizationHeader = req.get('Authorization');
    if (authorizationHeader) {
        const token = authorizationHeader.split(' ')[1];
        try {
            const isValidToken = jwt.verify(token, process.env.SECRET_KEY_JWT);
            if (isValidToken) {
                req.user = isValidToken.user;
                console.log(isValidToken);
                next();
            }
        } catch (error) {
            // Si ocurre un error al verificar el token, se envía una respuesta de error con un código de estado 401
            res.status(401).json({ message: 'Error de autenticación' });
            
        }
    } else {
        res.status(401).json({ message: 'Token de autenticación no proporcionado' });
    }
};