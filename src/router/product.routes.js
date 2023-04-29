import { Router } from "express";
import { ProductManager } from "../ProductManager.js";

const productManager = new ProductManager("./info.txt")
const productRouter = Router()

// Metodo para agregar productos al array inicial
productRouter.get("/realtimeproducts", async (req, res) => {
    let products = await productManager.getProducts();
    res.render("realTimeProducts", {
        titulo: `HOME - Todos los productos`,
        products: products,
    });
});

// Metodo para buscar una cierta cantidad de productos segun el limite deseado
productRouter.get("/", async (req, res) => {
    let products = await productManager.getProducts();
    const { limit } = req.query;
    const newLimit = Number(limit);
    if (limit) {
        products = products.slice(0, newLimit);
        res.render("home", {
            titulo: `${newLimit} productos mostrados`,
            products: products,
        });
    } else {
        res.render("home", {
            titulo: `HOME - Todos los productos`,
            products: products,
        });
    }
});

// Metodo para buscar un producto por id
productRouter.get("/:pid", async (req, res) => {
    const product = await productManager.getProductById(req.params.pid);
    res.render("product", {
        titulo: "Product / filtrado por Id",
        title: product.title,
        description: product.description,
        price: product.price,
        code: product.code,
        stock: product.stock,
        thumbnail: product.thumbnail,
        category: product.category,
        status: product.status,
        existe: product != false,
        mensaje: "Producto no encontrado",
        id: product.id,
    });
});


// Metodo para modificar un producto
productRouter.put("/:id", async (req, res) => {
    const id = req.params.id
    const { title, description, price, thumbnail, code, status, category, stock } = req.body
    const mensaje = await productManager.updateProduct(id, { title, description, price, thumbnail, code, status, category, stock })
    res.send(mensaje)
})


export default productRouter