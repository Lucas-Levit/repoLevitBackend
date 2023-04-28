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

// Metodo para agregar productos al array inicial
productRouter.get("/realtimeproducts", async (req, res) => {
    let products = await productManager.getProducts();
    res.render("realTimeProducts", {
        titulo: `HOME - Todos los productos`,
        products: products,
    });
});

// Metodo para agregar un producto nuevo al array existente
// productRouter.post("/realtimeproducts", async (req, res) => {
//     const { title, description, price, thumbnail, code, status, stock, category, } = req.body;
//     const result = await productManager.addProduct({ title, description, price, thumbnail, code, status, stock, category });
//     let products = await productManager.getProducts();
//     if (result === null) {
//         res.render("realTimeProducts", {
//             titulo: `real time products`,
//             products: products,
//         });
//         socket.emit("mensaje", {
//             titulo: `real time products`,
//             products: products,
//         });
//     } else {
//         res.render("realTimeProducts", {
//             titulo: `real time products`,
//             products: products,
//         });
//         socket.emit("mensaje", {
//             titulo: result.title,
//             descripcion: result.description,
//             precio: result.price,
//             categoria: result.category,
//             stock: result.stock,
//             status: result.status,
//             imagen: result.thumbnail,
//             codigo: result.code,
//             id: result.id,
//         });
//     }
// });





// Metodo para modificar un producto
productRouter.put("/:id", async (req, res) => {
    const id = req.params.id
    const { title, description, price, thumbnail, code, status, category, stock } = req.body
    const mensaje = await productManager.updateProduct(id, { title, description, price, thumbnail, code, status, category, stock })
    res.send(mensaje)
})

// Metodo para eliminar un producto
// productRouter.delete("/realtimeproducts", async (req, res) => {
//     const { id } = req.body;
//     const mensaje = await productManager.deleteProduct(id);
//     res.render("realTimeProducts", {
//         titulo: `real time products`,
//         products: mensaje,
//     });
// });
export default productRouter