import { Router } from "express";

const testRouter = Router();

testRouter.get("/loggerTest", (req, res) => {
    req.logger.fatal("Este es un mensaje fatal");
    req.logger.error("Este es un mensaje de error");
    req.logger.warning("Este es un mensaje de advertencia");
    req.logger.info("Este es un mensaje de información");
    req.logger.debug("Este es un mensaje de depuración");

    res.send("Logs registrados. Revisa la consola y el archivo error.log.");
});

export default testRouter;
