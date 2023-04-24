import express from "express";
import productRouter from './router/product.routes.js'
import { __dirname } from "./path.js";
import multer from "multer";
import cartRouter from "./router/cart.routes.js"
import { engine } from "express-handlebars";
import * as path from "path";
import { Server } from "socket.io";
import { ProductManager } from "./ProductManager.js";

//Configuraciones
const app = express()
const PORT = 4000
const productManager = new ProductManager("./info.txt")
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

//ServerIO
const io = new Server(server);
io.on("connection", (socket) => {
    console.log("Cliente conectado");
    socket.on("mensaje", (info) => {
        console.log(info);
    });
    socket.on("user", (info) => {
        console.log(info);
        socket.emit("confirmacionAcceso", "Acceso permitido");
    });
    //Mensaje que se envia a los clientes conectados a otros sockets
    socket.broadcast.emit("mensaje-socket-propio", "Datos jugadores");
});

//Routes
app.use('/products', productRouter)
app.use("/cart", cartRouter);
app.use('/', express.static(__dirname + '/public'))
app.post('/upload', upload.single('product'), (req, res) => {
    //Imagenes
    console.log(req.body)
    console.log(req.file)
    res.send("Imagen subida")
})

//HBS
app.get("/", async (req, res) => {
    let products = await productManager.getProducts();
    res.render("home", {
        titulo: "primera prueba" , 
        products: products,
    });
});