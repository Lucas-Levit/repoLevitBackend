import { Router } from "express";
import { cartModel } from "../DAL/mongoDB/models/Cart.js";
import { ticketModel } from "../DAL/mongoDB/models/Ticket.js";
import { productModel } from "../DAL/mongoDB/models/Products.js";
import { sendMail } from "../utils/nodemailer.js";
import { userModel } from "../DAL/mongoDB/models/User.js";



const ticketRouter = Router();

ticketRouter.get("/" , (req,res) =>{
    res.render("desition" , cart);
})

ticketRouter.post("/:cid",  async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await cartModel.findById(cid);
        console.log(cid);
        const user = await userModel.find({cart:cid})
        console.log(user[0].email);
        const email = user[0].email
        if (!cart ) {
            return res.status(404).send("Carrito no encontrado");
        }
        const totalQuantity = cart.products.reduce((total, product) => total + product.quantity, 0);
        const totalPrice = await calcularPrecioTotal(cart.products);
        // Aquí debes crear y guardar el ticket en tu base de datos
        const ticket = await ticketModel.create({
            amount: totalQuantity,
            totalPrice: totalPrice,
            purchaser: email,
            products: cart.products.map(product => ({
                id_prod: product.id_prod,
                quantity: product.quantity,
            })),
        });
        await ticket.save();
        await sendMail(
            email,
            "Ticket de compra",
            `${ticket}`
        );
        res.render("compraExitosa", { ticketId: ticket._id });


        async function calcularPrecioTotal(products) {
            try {
                let totalPrice = 0;
                for (const product of products) {
                    const productData = await productModel.findById(product.id_prod);
                    if (!productData) {
                        console.log(`Producto no encontrado para ID: ${product.id_prod}`);
                        continue; 
                    }
                    totalPrice += productData.price * product.quantity;
                }
                console.log("Total Price:", totalPrice);
                return totalPrice;
            } catch (error) {
                console.error("Error al acceder a la base de datos:", error);
                throw error; 
            }
        }
        
    } catch (error) {
        console.log(error);
        res.status(500).send("Error al generar el ticket de compra");
    }
    
});


ticketRouter.get("/compra" , (req,res) =>{
    res.render("compra", {  })
})

export default ticketRouter