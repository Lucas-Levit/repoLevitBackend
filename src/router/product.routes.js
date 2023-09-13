import { Router } from "express";
import { productModel } from "../DAL/mongoDB/models/Products.js";
import { userModel } from "../DAL/mongoDB/models/User.js";
import { cartModel } from "../DAL/mongoDB/models/Cart.js";
import passport from "passport";
import session from "express-session";

const productRouter = Router();

productRouter.get("/", async (req, res) => {
    try {
    // console.log(req.session)
    const userId = req.session.passport ?req.session.passport.user: null;
    if (!userId) {
        return res.status(400).json({ message: "Usuario no autenticado" });
    }
    const user = await userModel.findById(userId).populate("cart").lean().exec();
    if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
    }
    console.log(user)
    if (!user.cart) {
        const cart = new cartModel();
        await cart.save();
        user.cart = cart._id;
        await userModel.findByIdAndUpdate(userId, { cart: cart._id }).exec();
        user.cart = cart;
    }
    console.log(user.cart._id)
    const getProducts = await productModel.find().lean().exec();
    const products = getProducts.map(({ title, description, price, thumbnail, code, category, stock, status, _id }) => ({
        title,
        description,
        price,
        thumbnail,
        code,
        category,
        stock,
        status,
        _id,
    }));
    const profile = {
        first_name: user.first_name,
        last_name: user.last_name,
    };

    const isAdmin = user.role === "admin";
    console.log(user.cart._id.toString())
    const cartId = user.cart._id.toString()
    res.render("home.handlebars", {
        cartId,
        titulo: "HOME - TODOS LOS PRODUCTOS",
        products,
        user: profile,
        isAdmin // Pasar solo el ID del carrito
    });
    }
    catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener los productos" });
}
    });

productRouter.post("/", async (req, res) => {
    try {
        const { id_prod, quantity } = req.body;
        const userId = req.session.passport.user;
        let cart = await userModel.findById(userId);
        cart = cart.cart.toString();
        const nuevoProducto = { id_prod, quantity };
        await cartModel.findOneAndUpdate({ _id: cart }, { $push: { products: nuevoProducto } });
        res.redirect("/api/products/");
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al agregar el producto" });
    }
});

export default productRouter;


// productRouter.get("/", async (req, res) => {
//     const { limit = 10, page = 1, sort = "" } = req.query;
//     const query = {};
//     if (req.query.category) {
//         query.category = req.query.category;
//     }
//     if (req.query.status) {
//         query.status = req.query.status;
//     }
//     const ParsedPage = Number(page);
//     const skip = (ParsedPage - 1) * limit;
//     try {
//         const products = await productModel
//             .find(query)
//             .sort(sort === "asc" ? "price" : sort === "desc" ? "-price" : "")
//             .skip(skip)
//             .limit(limit);
//         const count = await productModel.countDocuments(query);
//         const totalPages = parseInt(count / limit);
//         const hasNextPage = Number(ParsedPage < totalPages);
//         const hasPrevPage = ParsedPage > 1;
//         const prevPage = hasPrevPage ? ParsedPage - 1 : null;
//         const nextPage = hasNextPage ? ParsedPage + 1 : null;
//         const prevLink = hasPrevPage
//             ? `${req.protocol}://${req.get("host")}${req.path
//             }?page=${prevPage}&limit=${limit}`
//             : null;
//         const nextLink = hasNextPage
//             ? `${req.protocol}://${req.get("host")}${req.path
//             }?page=${nextPage}&limit=${limit}`
//             : null;
//         const report = {
//             status: "success",
//             payload: products,
//             totalPages,
//             prevPage,
//             nextPage,
//             page: ParsedPage,
//             hasPrevPage,
//             hasNextPage,
//             prevLink,
//             nextLink,
//         };
//         res.status(200).json(report);
//     } catch (error) {
//         const report = {
//             status: "error",
//             payload: error.message,
//         };
//         res.status(500).json(report);
//     }
// });