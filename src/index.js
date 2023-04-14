import express from "express";
import { ProductManager } from "./main.js";

const app = express()
const productManager = new ProductManager("./info.txt")

const PORT = 4000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))


app.get("/products", async (req, res) => {
    let products = await productManager.getProduct();
    const Newproducts = JSON.parse(products);
    const { limit } = req.query;
    const newLimit = Number(limit);
    if (limit) {
        const newArray = Newproducts.splice(0, newLimit);
        res.send(JSON.stringify(newArray));
    } else {
        res.send(JSON.stringify(products));
    }
});



app.get("/products/:pid", async (req, res) => {
    let products = await productManager.getProductById(req.params.pid);
    res.send(products)
});

app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`)
})
