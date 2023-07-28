import { Router } from "express";
import { productModel } from "../DAL/mongoDB/models/Products.js";
import { userModel } from "../DAL/mongoDB/models/User.js";
import { cartModel } from "../DAL/mongoDB/models/Cart.js";
import { ticketModel } from "../DAL/mongoDB/models/Ticket.js";

const cartRouter = Router();

cartRouter.post("/:cid/products/:pid", async (req, res) => {
    try {
        const cid = req.params.cid;
        const pid = req.params.pid;
        const { quantity } = req.body;
        const parsedQuantity = parseInt(quantity);
        const cart = await cartModel.findById(cid);
        const product = await productModel.findById(pid);
        if (!cart || !product) {
            return res.status(404).send("Carrito o producto no encontrado");
        }
        if (parsedQuantity > product.stock) {
            return res.status(400).send("No hay suficiente stock disponible");
        }
        product.stock -= parsedQuantity;
        await product.save();
        const addProductToCart = {
            id_prod: pid,
            quantity: parsedQuantity,
        };
        cart.products.push(addProductToCart);
        await cart.save();
        console.log(cart);
        console.log(addProductToCart);
        res.send("Producto añadido correctamente");
    } catch (error) {
        console.log(error);
        res.status(500).send("Error al agregar el producto al carrito");
    }
});

cartRouter.delete("/:cid", async (req, res) => {
    const cid = req.params.cid;
    try {
        const cart = await cartModel.findByIdAndDelete(cid);
        if (!cart) {
            return res.status(404).send("Carrito no encontrado");
        }
        res.send("Carrito eliminado correctamente");
    } catch (error) {
        console.log(error);
        res.status(500).send("Error al eliminar el carrito");
    }
});

cartRouter.get("/:cid", async (req, res) => {
    const cid = req.params.cid;
    try {
        const cart = await cartModel.findById(cid).populate("products.id_prod");
        if (!cart) {
            return res.status(404).send("Carrito no encontrado");
        }
        res.send(cart.products);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error al obtener el carrito");
    }
});

cartRouter.put("/:cid", async (req, res) => {
    const cid = req.params.cid;
    const { products } = req.body || {};
    if (!products) {
        return res.status(400).send({ message: "Productos no encontrados" });
    }
    try {
        const cart = await cartModel.findById(cid);
        if (!cart) {
            return res.status(404).send("Carrito no encontrado");
        }
        for (let i = 0; i < cart.products.length; i++) {
            const product = cart.products[i];
            const updatedProduct = products.find(
                (p) => p.id_prod.toString() === product.id_prod.toString()
            );
            if (updatedProduct) {
                const quantity = parseInt(updatedProduct.quantity);
                const productToUpdate = await productModel.findById(product.id_prod);
                if (!productToUpdate) {
                    return res.status(404).send("Producto no encontrado en la base de datos");
                }
                productToUpdate.stock += product.quantity;
                productToUpdate.stock -= quantity;
                product.quantity = quantity;
                await productToUpdate.save();
            }
        }
        cart.products = products;
        await cart.save();
        res.send("Carrito actualizado correctamente");
    } catch (error) {
        console.log(error);
        res.status(500).send("Error al actualizar el carrito");
    }
});

cartRouter.post("/:cid/purchase", async (req, res) => {
    const cid = req.params.cid;
    try {
        const cart = await cartModel.findById(cid).populate("products.id_prod");
        const productsToPurchase = [];
        const productsNotPurchased = [];
        for (const product of cart.products) {
            const productInStock = await productModel.findById(product.id_prod);
            if (product.quantity <= productInStock.stock) {
                // Suficiente stock, restar del stock del producto
                productInStock.stock -= product.quantity;
                await productInStock.save();
                productsToPurchase.push(product);
            } else {
                // No hay suficiente stock, no agregar al proceso de compra
                productsNotPurchased.push(product);
            }
        }
        // Crear el ticket con los datos de la compra
        const ticket = await ticketModel.create({
            // Aquí debes establecer correctamente el monto y el comprador según la lógica de tu aplicación
            amount: 100,
            purchaser: "correo-del-comprador@example.com", 
        });
        
        // Actualizar el carrito solo con los productos no comprados
        cart.products = productsNotPurchased;
        await cart.save();
        res.send({
            message: "Proceso de compra finalizado exitosamente",
            ticket: ticket,
            productsNotPurchased: productsNotPurchased,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al finalizar el proceso de compra");
    }
});

export default cartRouter;
