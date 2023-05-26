import { Router } from "express";
import { productModel } from "../models/Products.js";
// import { ProductManager } from "../ProductManager.js";

// const productManager = new ProductManager("./info.txt")
const productRouter = Router()


// Metodo para agregar productos al array inicial
productRouter.get("/realtimeproducts", async (req, res) => {
    const products = await productModel.collection("products").find({}).toArray();
    res.render("realTimeProducts", {
        titulo: `HOME - Todos los productos`,
        products: products,
    });
});

// Metodo para buscar una cierta cantidad de productos segun el limite deseado
productRouter.get("/", async (req, res) => {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(
        req.query.page
    ) || 1;
    const sort = req.query.sort || "";
    const query = req.query.query || {};
    const skip = (page - 1) * limit;

    try {
        const products = await productModel
            .find(query)
            .sort(sort === "asc" ? "price" : sort === "desc" ? "-price" : "")
            .skip(skip)
            .limit(limit);
        res.status(200).json(products);
        const report = await productModel.paginate(
            { status: true, category: "F" },
            { limit: 10, page: 1 }
        );
        console.log(report);
    } catch (error) {
        res.status(500).json({ message: error.message });
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