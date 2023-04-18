import { Router } from "express";
import { CartManager } from "../CartManager.js";


const cartManager = new CartManager("./carrito.txt");
const cartRouter = Router();

// Metodo para agregar productos al array inicial
// cartRouter.get("/", async (req, res) => {
//     let products = await cartManager.getProducts();
//     const { limit } = req.query;
//     const newLimit = Number(limit);
//     if (limit) {
//         const newArray = products.slice(0, newLimit);
//         res.send((newArray));
//     } else {
//         res.send((products));
//     }
// });


// Metodo para buscar un producto por id
// cartRouter.get("/:pid", async (req, res) => {
//     const product = await cartManager.getProductById(req.params.pid);
//     const JSONproduct = (product);
//     res.send(JSONproduct);
// });


// Metodo para agregar un producto nuevo al array existente
cartRouter.post("/", async (req, res) => {
    try {
        const { id, quantity, idCart } = req.body;
        await cartManager.addProductCart(id, quantity, idCart);
        res.send("Producto agregado al carrito exitosamente");
    } catch (error) {
        res.send(error)
    }
});


export default cartRouter