import { Router } from "express";
import { ProductManager } from "../ProductManager.js";

const productManager = new ProductManager("./info.txt")
const productRouter = Router()


// Metodo para agregar productos al array inicial
productRouter.get("/", async (req, res) => {
    let products = await productManager.getProducts();
    const { limit } = req.query;
    const newLimit = Number(limit);
    if (limit) {
        const newArray = products.slice(0, newLimit);
        res.send((newArray));
    } else {
        res.send((products));
    }
});

// Metodo para buscar un producto por id
productRouter.get("/:pid", async (req, res) => {
    const product = await productManager.getProductById(req.params.pid);
    res.render("product", {
        title: product.title,
        description: product.description,
        price: product.price,
        code: product.code,
        stock: product.stock,
    });
});

// Metodo para agregar un producto nuevo al array existente
productRouter.post("/", async (req, res) => {
    const { title, description, price, thumbnail, code, status, stock, category } = req.body;
    const result = await productManager.addProduct({ title, description, price, thumbnail, code, status, stock, category });
    if (result === null) {
        res.send("Producto creado exitosamente");
    } else {
        res.send("ocurrio un error en la carga. Intente nuevamente");
    }
});

// Metodo para modificar un producto
productRouter.put("/:id", async (req, res) => {
    const id = req.params.id
    const { title, description, price, thumbnail, code, status, category, stock } = req.body
    const mensaje = await productManager.updateProduct(id, { title, description, price, thumbnail, code, status, category, stock })
    res.send(mensaje)
})


// Metodo para eliminar un producto
productRouter.delete("/:id", async (req, res) => {
    const id = req.params.id
    const mensaje = await productManager.deleteProduct(id)
    res.send(mensaje)
})

export default productRouter