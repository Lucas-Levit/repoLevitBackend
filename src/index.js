import express from "express";
import { ProductManager } from "./main.js";

const app = express()
const productManager = new ProductManager("/info.txt")

const PORT = 4000

app.use(express.urlencoded({ extended: true }))



app.get("/", (req, res) => {
    res.send("mi primer servidor con express")
})

app.get('/product/', async (req, res) => {
    let { limit } = req.query
    const products = await productManager.getProducts()
    res.send(JSON.stringify(products))
})

app.get('/user/:id', (req, res) => {
    const user = users.find(usuario => usuario.id === parseInt(req.params.id)) //Consulto un usuario dado el id recibido
    if (user) {
        res.send(`El usuario con el id ${req.params.id} se llama ${user.nombre}`)
    } else {
        res.send(`El usuario con el id ${req.params.id} no se encuentra`)
    }

})