import { error } from "console";
import EErrors from "../services/errors/enum.js";

export default (error, req, res, next) => {
    console.log(error.cause);
    switch (error.code) {
        case EErrors.INVALID_TYPES_ERROR:
            res.status(400).json({ status: "error", error: error.message });
            break;
        default:
            res.status(500).json({ status: "error", error: "Error no encontrado" });
            break;
    }
};
