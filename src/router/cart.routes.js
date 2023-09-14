import { Router } from "express";
import { productModel } from "../DAL/mongoDB/models/Products.js";
import { userModel } from "../DAL/mongoDB/models/User.js";
import { cartModel } from "../DAL/mongoDB/models/Cart.js";
import { ticketModel } from "../DAL/mongoDB/models/Ticket.js";

const cartRouter = Router();

// cartRouter.post("/:cid/products/:pid", async (req, res) => {
//     try {
//         const { cid, pid } = req.params;
//         const { quantity } = req.body;
//         const parsedQuantity = parseInt(quantity);
//         const cart = await cartModel.findById(cid);
//         const product = await productModel.findById(pid);
//         if (!cart || !product) {
//             return res.status(404).send("Carrito o producto no encontrado");
//         }
//         if (parsedQuantity > product.stock) {
//             return res.status(400).send("No hay suficiente stock disponible");
//         }
//         // Restar la cantidad del producto del stock
//         product.stock -= parsedQuantity;
//         await product.save();
//         // Agregar el producto al carrito
//         const addProductToCart = {
//             id_prod: pid,
//             quantity: parsedQuantity,
//         };
//         cart.products.push(addProductToCart);
//         await cart.save();

// // Crear el ticket con los datos de la compra
// const totalQuantity = cart.products.reduce((total, product) => total + product.quantity, 0);
// const totalPrice = await calcularPrecioTotal(cart.products); // Espera a la resolución de la promesa
// const ticket = await ticketModel.create({
//     amount: totalQuantity,
//     totalPrice: totalPrice, // Ahora es un valor numérico
//     purchaser: "correo-del-comprador@example.com",
//     products: cart.products.map(product => ({
//         id_prod: product.id_prod,
//         quantity: product.quantity,
//     })),
// });

// // Función para calcular el precio total de la compra
// async function calcularPrecioTotal(products) {
//     let totalPrice = 0;
//     for (const product of products) {
//         const productData = await productModel.findById(product.id_prod);
//         totalPrice += productData.price * product.quantity;
//     }
//     console.log("Total Price:", totalPrice);
//     return totalPrice;
// }


// // Envía la respuesta al cliente
//         res.send("Producto añadido al carrito y ticket de compra generado");
//     } catch (error) {
//         console.log(error);
//         res.status(500).send("Error al agregar el producto al carrito");
//     }
// });


// Controlador para agregar productos al carrito
cartRouter.post("/:cid/products/:pid", async (req, res) => {
    try {
        const { generateTicket } = req.body;
        const { cid, pid } = req.params;
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
        // Restar la cantidad del producto del stock
        product.stock -= parsedQuantity;
        await product.save();

        // Agregar el producto al carrito
        const addProductToCart = {
            id_prod: pid,
            quantity: parsedQuantity,
        };
        cart.products.push(addProductToCart);
        await cart.save();

        // Después de agregar un producto al carrito
        const cartId = req.params.cid;
        const productId = req.params.pid;

        if (generateTicket) {
            // Generar el ticket
            const totalQuantity = cart.products.reduce((total, product) => total + product.quantity, 0);
            const totalPrice = await calcularPrecioTotal(cart.products);
            const ticket = await ticketModel.create({
                amount: totalQuantity,
                totalPrice: totalPrice,
                purchaser: "correo-del-comprador@example.com",
                products: cart.products.map(product => ({
                    id_prod: product.id_prod,
                    quantity: product.quantity,
                })),
            });

            async function calcularPrecioTotal(products) {
                let totalPrice = 0;
                for (const product of products) {
                    const productData = await productModel.findById(product.id_prod);
                    totalPrice += productData.price * product.quantity;
                }
                console.log("Total Price:", totalPrice);
                return totalPrice;
            }
            // Redirigir al usuario a la vista de decisión
            res.redirect(`/api/cart/${cartId}/products/${productId}/decision`);
        } else {
            // Redirigir al usuario a la página de productos sin generar un ticket
            res.redirect("/api/products");
        }
    } catch (error) {
        console.log(error);
        res.status(500).send("Error al agregar el producto al carrito");
    }
});

// Controlador para procesar la decisión del usuario
cartRouter.post("/:cid/products/:pid/decision", async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { decision } = req.body;
        if (decision === "Seguir Comprando") {
            // Redirigir al usuario de vuelta a la página de productos
            res.redirect(`/productos`);
        } else if (decision === "Finalizar Compra") {
            // Generar el ticket de compra aquí
            const cart = await cartModel.findById(cid);
            if (!cart) {
                return res.status(404).send("Carrito no encontrado");
            }
            const totalQuantity = cart.products.reduce((total, product) => total + product.quantity, 0);
            const totalPrice = await calcularPrecioTotal(cart.products);
            
            // Aquí debes crear y guardar el ticket en tu base de datos
            const ticket = await ticketModel.create({
                amount: totalQuantity,
                totalPrice: totalPrice,
                purchaser: "correo-del-comprador@example.com",
                products: cart.products.map(product => ({
                    id_prod: product.id_prod,
                    quantity: product.quantity,
                })),
            });
            async function calcularPrecioTotal(products) {
                let totalPrice = 0;
                for (const product of products) {
                    const productData = await productModel.findById(product.id_prod);
                    totalPrice += productData.price * product.quantity;
                }
                console.log("Total Price:", totalPrice);
                return totalPrice;
            }
            // Redirigir al usuario a la página de confirmación de compra o al resumen del ticket
            res.redirect("/confirmacion-compra");
        } else {
            // Manejar otro caso o error si es necesario
            res.status(400).send("Decisión no válida");
        }
    } catch (error) {
        console.log(error);
        res.status(500).send("Error al procesar la decisión del usuario");
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
            amount: 100,
            purchaser: "correo-del-comprador@example.com",
            products: productsToPurchase.map(product => ({
                id_prod: product.id_prod,
                quantity: product.quantity,
            })),
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
