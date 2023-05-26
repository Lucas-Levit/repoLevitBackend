import express from "express";
import productRouter from './router/product.routes.js'
import { __dirname } from "./path.js";
import multer from "multer";
import cartRouter from "./router/cart.routes.js"
import { engine } from "express-handlebars";
import * as path from "path";
import { Server } from "socket.io";
import mongoose from "mongoose";
import { productModel } from "./models/Products.js";
import { cartModel } from "./models/Cart.js";
import "dotenv/config";
// import  cookieParser  from "cooke-parser";
// import  session from "express-session";


//Configuraciones
mongoose
    .connect(process.env.URL_MONGODB_ATLAS)
    .then(() => console.log("DB is connected"))
    .catch((error) => console.log("Error en MongoDB Atlas :", error));


const app = express()
const PORT = 4000
// await cartModel.create([{}]);


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'src/public/img')
    },
    filename: (req, file, cb) => {
        cb(null, `${file.originalname}`)
    }
})
app.engine("handlebars", engine())
app.set("view engine", "handlebars")
app.set("views", path.resolve(__dirname, "./views"))


const server = app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`)
})

//Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
const upload = (multer({ storage: storage }))

//Routes
app.use('/api/products', productRouter)
app.use("/api/cart", cartRouter);
app.use('/', express.static(__dirname + '/public'))
app.post('/upload', upload.single('product'), (req, res) => {
    //Imagenes
    console.log(req.body)
    console.log(req.file)
    res.send("Imagen subida")
})


//Crear cookie
app.get('/setCookie', (req, res) => {
    //Nombre cookie - Valor asociado a dicha cookie
    res.cookie('CookieCookie', "Esta es mi primer cookie")
})

//Consultar cookie

app.get('/getCookie', (req, res) => {
    //Nombre cookie - Valor asociado a dicha cookie
    res.send(req.cookies)
})

app.get('/setCookie', (req, res) => {
    //Nombre cookie - Valor asociado a dicha cookie
    res.cookie('CookieCookie', "Esta es mi primer cookie")
    res.send("Cookie creada")
})

//Consultar cookie
app.get('/getCookie', (req, res) => {
    //Nombre cookie - Valor asociado a dicha cookie
    res.send(req.cookies)
})

/* ------------------------------ Codigo socket ----------------------------- */
// const io = new Server(server);
// io.on("connection", (socket) => {
//     console.log("cliente conectado");
//     socket.on("productoIngresado", async ([info]) => {
//         const title = info.title;
//         const description = info.description;
//         const price = info.price;
//         const thumbnail = info.thumbnail;
//         const code = info.code;
//         const status = info.status;
//         const stock = info.stock;
//         const category = info.category;
//         await productManager.addProduct({
//             title, description, price, thumbnail, code, status, stock, category
//         });
//         const newProducts = await productManager.getProducts();
//         io.emit("nuevosproductos", newProducts);
//     });


//     socket.on("productoEliminado", async (id) => {
//         await productManager.deleteProduct(id);
//         const newProducts = await productManager.getProducts();
//         io.emit("nuevosproductos", newProducts);
//     });

//     socket.on("carrito", async () => {
//         await cartManager.deleteProduct(id);
//         const newCarts = await cartManager.createCarrito();
//         io.emit("nuevoCarrito", newCarts);
//     });
//     socket.on("nuevoCarrito", async (data) => {
//         await cartManager.createCarrito(data);
//         const newCarts = await cartManager.getCarts();
//         io.emit("nuevosCarritos", newCarts);
//     });
//     socket.on("nuevoMensaje", async ([data]) => {
//         const user = data.user;
//         const mensaje = data.message;
//         await messagesManager.addMessage(user, mensaje);
//         const newMessage = await messagesManager.getMessages();
//         io.emit("nuevosMensajes", newMessage);
//     });
// });



/* ---------------------------- Codigo handlebars --------------------------- */
//HBS
// app.get("/", async (req, res) => {
//     let products = await productManager.getProducts();
//     res.render("home", {
//         titulo: "primera prueba",
//         products: products,
//     });
// });

// app.get("/realtimeproducts", async (req, res) => {
//     const getProducts = await productManager.getProducts();
//     res.render("realTimeProducts", {
//         titulo: "real time products",
//         products: getProducts,
//     });
// });

// app.get("/carts", async (req, res) => {
//     const carts = await cartManager.getCarts();
//     res.render("carts", {
//         titulo: "Carrito",
//         carts: carts,
//     });
// });

// app.get("/chat", async (req, res) => {
//     const messages = await messagesManager.getMessages();
//     res.render("chat", {
//         titulo: "chat",
//         messages: messages,
//     });
// });

/* -------------------- Productos para hacer las pruebas -------------------- */

// await productModel.create([
//     {
//         title: "1",
//         description: "1",
//         code: "1",
//         category: "123",
//         price: 100,
//         stock: 100,
//         status: true,
//         thumbnail: ["hola"],
//     },
//     {
//         title: "2",
//         description: "2",
//         code: "2",
//         category: "FASD",
//         price: 100,
//         stock: 100,
//         status: true,
//         thumbnail: ["hola"],
//     },
//     {
//         title: "3",
//         description: "3",
//         code: "3",
//         category: "Fadfsf",
//         price: 100,
//         stock: 100,
//         status: true,
//         thumbnail: ["hola"],
//     },
//     {
//         title: "4",
//         description: "4",
//         code: "4",
//         category: "Ffghfg",
//         price: 100,
//         stock: 100,
//         status: true,
//         thumbnail: ["hola"],
//     },
//     {
//         title: "5",
//         description: "5",
//         code: "5",
//         category: "F",
//         price: 100,
//         stock: 100,
//         status: true,
//         thumbnail: ["hola"],
//     },
//     {
//         title: "6",
//         description: "6",
//         code: "6",
//         category: "F",
//         price: 100,
//         stock: 100,
//         status: true,
//         thumbnail: ["hola"],
//     },
//     {
//         title: "7",
//         description: "7",
//         code: "7",
//         category: "F",
//         price: 100,
//         stock: 100,
//         status: true,
//         thumbnail: ["hola"],
//     },
//     {
//         title: "8",
//         description: "8",
//         code: "8",
//         category: "F",
//         price: 100,
//         stock: 100,
//         status: true,
//         thumbnail: ["hola"],
//     },
//     {
//         title: "9",
//         description: "9",
//         code: "9",
//         category: "F",
//         price: 100,
//         stock: 100,
//         status: true,
//         thumbnail: ["hola"],
//     },
//     {
//         title: "10",
//         description: "10",
//         code: "10",
//         category: "F",
//         price: 100,
//         stock: 100,
//         status: true,
//         thumbnail: ["hola"],
//     },
//     {
//         title: "11",
//         description: "11",
//         code: "11",
//         category: "F",
//         price: 100,
//         stock: 100,
//         status: true,
//         thumbnail: ["hola"],
//     },
//     {
//         title: "12",
//         description: "12",
//         code: "12",
//         category: "F",
//         price: 100,
//         stock: 100,
//         status: true,
//         thumbnail: ["hola"],
//     },
//     {
//         title: "13",
//         description: "13",
//         code: "13",
//         category: "F",
//         price: 100,
//         stock: 100,
//         status: true,
//         thumbnail: ["hola"],
//     },
//     {
//         title: "14",
//         description: "14",
//         code: "14",
//         category: "F",
//         price: 100,
//         stock: 100,
//         status: true,
//         thumbnail: ["hola"],
//     },
//     {
//         title: "15",
//         description: "15",
//         code: "15",
//         category: "F",
//         price: 100,
//         stock: 100,
//         status: true,
//         thumbnail: ["hola"],
//     },
//     {
//         title: "16",
//         description: "16",
//         code: "16",
//         category: "F",
//         price: 100,
//         stock: 100,
//         status: true,
//         thumbnail: ["hola"],
//     },
//     {
//         title: "17",
//         description: "17",
//         code: "17",
//         category: "F",
//         price: 100,
//         stock: 100,
//         status: true,
//         thumbnail: ["hola"],
//     },
//     {
//         title: "18",
//         description: "18",
//         code: "18",
//         category: "F",
//         price: 100,
//         stock: 100,
//         status: true,
//         thumbnail: ["hola"],
//     },
//     {
//         title: "19",
//         description: "19",
//         code: "19",
//         category: "F",
//         price: 100,
//         stock: 100,
//         status: true,
//         thumbnail: ["hola"],
//     },
//     {
//         title: "20",
//         description: "20",
//         code: "20",
//         category: "F",
//         price: 100,
//         stock: 100,
//         status: true,
//         thumbnail: ["hola"],
//     },
// ]);


