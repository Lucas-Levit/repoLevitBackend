import express from "express";
import productRouter from './router/product.routes.js'
import { __dirname } from "./utils/path.js";
import multer from "multer";
import cartRouter from "./router/cart.routes.js"
import { engine } from "express-handlebars";
import * as path from "path";
import { productModel } from "./DAL/mongoDB/models/Products.js";
import { cartModel } from "./DAL/mongoDB/models/Cart.js";
import "dotenv/config";
import "./utils/bcrypt.js"
import passport from "passport";
import MongoStore from "connect-mongo";
import cookieParser from "cookie-parser";
import session from "express-session";
import sessionRouter from "./router/session.routes.js";
import jwtRouter from './router/jwt.routes.js'
import FileStore from "session-file-store";
import "../src/passport/passportStrategies.js";
import cors from "cors";
import config from "./config/config.js";
import "./config/configDB.js"
import usersRouter from "./router/users.routes.js"
import messagesRouter from "./router/messages.router.js";
import compression from "express-compression"
import errorHandler from "./middlewares/error.js";
import getAllusers from './router/users.routes.js'
import { addLogger } from "./utils/logger.js";
import testRouter from "./router/test.routes.js";
import swaggerJsdoc from  'swagger-jsdoc'
import swaggerUiExpress from 'swagger-ui-express'
import ticketRouter from "./router/ticket.routes.js";

//Configuraciones
const fileStore = FileStore(session);
const app = express();


app.use(cookieParser())
const PORT = 4000


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
app.set("views", path.resolve(__dirname, "./src/views"))


const swaggerOptions={
    definition:{
        openapi:'3.0.1',
        info:{
            title:" Documentacion de las APIs",
            description:" Informacion pert y usuarios",
            version: '1.0.0',
            contact:{
                name:"Lucas Levit",
                url: "https://www.linkedin.com/in/lucas-levit-87b8961b3/"
            }
        }
    },
    apis: [`${process.cwd()}/src/docs/**/*.yaml`],
}
const spec = swaggerJsdoc(swaggerOptions)

const server = app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`)
})


//Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(compression())


const upload = (multer({ storage: storage }))

app.use(session({
    store: MongoStore.create({
        mongoUrl: process.env.URL_MONGODB_ATLAS,
        dbName: "ecommerce",
        collectionName: "cookies"
    }),
    secret: "mysecret",
    resave: false,
    saveUninitialized: false
}))

app.use(addLogger)
//Routes
app.use('/api/products', productRouter)
app.use("/api/cart", cartRouter);
app.use('/', express.static(__dirname + '/public'))
app.use("/sessions", sessionRouter)
app.use("/api/jwt", jwtRouter)
app.use("/api/users", usersRouter)
app.use("/api/message", messagesRouter)
app.use("/api/ticket" , ticketRouter)
app.use(cors())
app.use('/productos', getAllusers)
app.use("/loggerTest", testRouter);
app.use('/apidoc',swaggerUiExpress.serve,swaggerUiExpress.setup(spec))


app.post('/upload', upload.single('product'), (req, res) => {
    //Imagenes
    console.log(req.body)
    console.log(req.file)
    res.send("Imagen subida")
})


//Passport
app.use(passport.initialize())
app.use(passport.session())
app.use(errorHandler);
app.get("/", async (req, res) => {
    res.render("sessions/login");
});

//conection chat

import {Server} from "socket.io"

const io = new Server(server)

io.on("connection" , (socket) => {
    console.log("Nuevo cliente conectado")
    
    socket.on("send_message" , (data) => {
        io.emit("receive_message" , data)
    })

    socket.on("disconnect" , () => {
        console.log("Cliente desconectado");
    })
})



/* -------------------- Productos para hacer las pruebas -------------------- */

// await productModel.create([
//     {
//         title: "Product 16",
//         description: "Description for Product 16",
//         code: "CODE16",
//         category: "Category 1",
//         price: 115,
//         stock: 115,
//         status: true,
//         thumbnail: ["hola"]
//     },
//     {
//         title: "Product 17",
//         description: "Description for Product 17",
//         code: "CODE17",
//         category: "Category 1",
//         price: 116,
//         stock: 116,
//         status: true,
//         thumbnail: ["hola"]
//     },])
//     {
//         title: "Product 18",
//         description: "Description for Product 18",
//         code: "CODE18",
//         category: "Category 1",
//         price: 117,
//         stock: 117,
//         status: true,
//         thumbnail: ["hola"]
//     }
//     ])
// ,
//     {
//         title: "Product 19",
//         description: "Description for Product 19",
//         code: "CODE19",
//         category: "Category 1",
//         price: 118,
//         stock: 118,
//         status: true,
//         thumbnail: ["hola"]
//     },
//     {
//         title: "Product 20",
//         description: "Description for Product 20",
//         code: "CODE20",
//         category: "Category 1",
//         price: 119,
//         stock: 119,
//         status: true,
//         thumbnail: ["hola"]
//     },
//     {
//         title: "Product 21",
//         description: "Description for Product 21",
//         code: "CODE21",
//         category: "Category 2",
//         price: 120,
//         stock: 120,
//         status: true,
//         thumbnail: ["hola"]
//     },
//     {
//         title: "Product 22",
//         description: "Description for Product 22",
//         code: "CODE22",
//         category: "Category 2",
//         price: 121,
//         stock: 121,
//         status: true,
//         thumbnail: ["hola"]
//     },
//     {
//         title: "Product 23",
//         description: "Description for Product 23",
//         code: "CODE23",
//         category: "Category 2",
//         price: 122,
//         stock: 122,
//         status: true,
//         thumbnail: ["hola"]
//     },
//     {
//         title: "Product 24",
//         description: "Description for Product 24",
//         code: "CODE24",
//         category: "Category 2",
//         price: 123,
//         stock: 123,
//         status: true,
//         thumbnail: ["hola"]
//     },
//     {
//         title: "Product 25",
//         description: "Description for Product 25",
//         code: "CODE25",
//         category: "Category 2",
//         price: 124,
//         stock: 124,
//         status: true,
//         thumbnail: ["hola"]
//     },
//     {
//         title: "Product 26",
//         description: "Description for Product 26",
//         code: "CODE26",
//         category: "Category 3",
//         price: 125,
//         stock: 125,
//         status: true,
//         thumbnail: ["hola"]
//     },
//     {
//         title: "Product 27",
//         description: "Description for Product 27",
//         code: "CODE27",
//         category: "Category 3",
//         price: 126,
//         stock: 126,
//         status: true,
//         thumbnail: ["hola"]
//     },
//     {
//         title: "Product 28",
//         description: "Description for Product 28",
//         code: "CODE28",
//         category: "Category 3",
//         price: 127,
//         stock: 127,
//         status: true,
//         thumbnail: ["hola"]
//     },
//     {
//         title: "Product 29",
//         description: "Description for Product 29",
//         code: "CODE29",
//         category: "Category 3",
//         price: 128,
//         stock: 128,
//         status: true,
//         thumbnail: ["hola"]
//     },
//     {
//         title: "Product 30",
//         description: "Description for Product 30",
//         code: "CODE30",
//         category: "Category 3",
//         price: 129,
//         stock: 129,
//         status: true,
//         thumbnail: ["hola"]
//     },
//     {
//         title: "Product 31",
//         description: "Description for Product 31",
//         code: "CODE31",
//         category: "Category 1",
//         price: 130,
//         stock: 130,
//         status: true,
//         thumbnail: ["hola"]
//     },
//     {
//         title: "Product 32",
//         description: "Description for Product 32",
//         code: "CODE32",
//         category: "Category 1",
//         price: 131,
//         stock: 131,
//         status: true,
//         thumbnail: ["hola"]
//     },
//     {
//         title: "Product 33",
//         description: "Description for Product 33",
//         code: "CODE33",
//         category: "Category 1",
//         price: 132,
//         stock: 132,
//         status: true,
//         thumbnail: ["hola"]
//     },
//     {
//         title: "Product 34",
//         description: "Description for Product 34",
//         code: "CODE34",
//         category: "Category 1",
//         price: 133,
//         stock: 133,
//         status: true,
//         thumbnail: ["hola"]
//     },
//     {
//         title: "Product 35",
//         description: "Description for Product 35",
//         code: "CODE35",
//         category: "Category 1",
//         price: 134,
//         stock: 134,
//         status: true,
//         thumbnail: ["hola"]
//     },
//     {
//         title: "Product 36",
//         description: "Description for Product 36",
//         code: "CODE36",
//         category: "Category 2",
//         price: 135,
//         stock: 135,
//         status: true,
//         thumbnail: ["hola"]
//     },
//     {
//         title: "Product 37",
//         description: "Description for Product 37",
//         code: "CODE37",
//         category: "Category 2",
//         price: 136,
//         stock: 136,
//         status: true,
//         thumbnail: ["hola"]
//     },
//     {
//         title: "Product 38",
//         description: "Description for Product 38",
//         code: "CODE38",
//         category: "Category 2",
//         price: 137,
//         stock: 137,
//         status: true,
//         thumbnail: ["hola"]
//     },
//     {
//         title: "Product 39",
//         description: "Description for Product 39",
//         code: "CODE39",
//         category: "Category 2",
//         price: 138,
//         stock: 138,
//         status: true,
//         thumbnail: ["hola"]
//     },
//     {
//         title: "Product 40",
//         description: "Description for Product 40",
//         code: "CODE40",
//         category: "Category 2",
//         price: 139,
//         stock: 139,
//         status: true,
//         thumbnail: ["hola"]
//     },
//     {
//         title: "Product 41",
//         description: "Description for Product 41",
//         code: "CODE41",
//         category: "Category 3",
//         price: 140,
//         stock: 140,
//         status: true,
//         thumbnail: ["hola"]
//     },
//     {
//         title: "Product 42",
//         description: "Description for Product 42",
//         code: "CODE42",
//         category: "Category 3",
//         price: 141,
//         stock: 141,
//         status: true,
//         thumbnail: ["hola"]
//     },
//     {
//         title: "Product 43",
//         description: "Description for Product 43",
//         code: "CODE43",
//         category: "Category 3",
//         price: 142,
//         stock: 142,
//         status: true,
//         thumbnail: ["hola"]
//     },
//     {
//         title: "Product 44",
//         description: "Description for Product 44",
//         code: "CODE44",
//         category: "Category 3",
//         price: 143,
//         stock: 143,
//         status: true,
//         thumbnail: ["hola"]
//     },
//     {
//         title: "Product 45",
//         description: "Description for Product 45",
//         code: "CODE45",
//         category: "Category 3",
//         price: 144,
//         stock: 144,
//         status: true,
//         thumbnail: ["hola"]
//     },
//     {
//         title: "Product 46",
//         description: "Description for Product 46",
//         code: "CODE46",
//         category: "Category 4",
//         price: 145,
//         stock: 145,
//         status: true,
//         thumbnail: ["hola"]
//     },
//     {
//         title: "Product 47",
//         description: "Description for Product 47",
//         code: "CODE47",
//         category: "Category 4",
//         price: 146,
//         stock: 146,
//         status: true,
//         thumbnail: ["hola"]
//     },
//     {
//         title: "Product 48",
//         description: "Description for Product 48",
//         code: "CODE48",
//         category: "Category 4",
//         price: 147,
//         stock: 147,
//         status: true,
//         thumbnail: ["hola"]
//     },
//     {
//         title: "Product 49",
//         description: "Description for Product 49",
//         code: "CODE49",
//         category: "Category 4",
//         price: 148,
//         stock: 148,
//         status: true,
//         thumbnail: ["hola"]
//     },
//     {
//         title: "Product 50",
//         description: "Description for Product 50",
//         code: "CODE50",
//         category: "Category 4",
//         price: 149,
//         stock: 149,
//         status: true,
//         thumbnail: ["hola"]
//     },
//     {
//         title: "Product 51",
//         description: "Description for Product 51",
//         code: "CODE51",
//         category: "Category 5",
//         price: 150,
//         stock: 150,
//         status: true,
//         thumbnail: ["hola"]
//     },
//     {
//         title: "Product 52",
//         description: "Description for Product 52",
//         code: "CODE52",
//         category: "Category 5",
//         price: 151,
//         stock: 151,
//         status: true,
//         thumbnail: ["hola"]
//     },
//     {
//         title: "Product 53",
//         description: "Description for Product 53",
//         code: "CODE53",
//         category: "Category 5",
//         price: 152,
//         stock: 152,
//         status: true,
//         thumbnail: ["hola"]
//     },
//     {
//         title: "Product 54",
//         description: "Description for Product 54",
//         code: "CODE54",
//         category: "Category 5",
//         price: 153,
//         stock: 153,
//         status: true,
//         thumbnail: ["hola"]
//     },
//     {
//         title: "Product 55",
//         description: "Description for Product 55",
//         code: "CODE55",
//         category: "Category 5",
//         price: 154,
//         stock: 154,
//         status: true,
//         thumbnail: ["hola"]
//     },
//     {
//         title: "Product 56",
//         description: "Description for Product 56",
//         code: "CODE56",
//         category: "Category 1",
//         price: 155,
//         stock: 155,
//         status: true,
//         thumbnail: ["hola"]
//     },
//     {
//         title: "Product 57",
//         description: "Description for Product 57",
//         code: "CODE57",
//         category: "Category 1",
//         price: 156,
//         stock: 156,
//         status: true,
//         thumbnail: ["hola"]
//     },
//     {
//         title: "Product 58",
//         description: "Description for Product 58",
//         code: "CODE58",
//         category: "Category 1",
//         price: 157,
//         stock: 157,
//         status: true,
//         thumbnail: ["hola"]
//     },
//     {
//         title: "Product 59",
//         description: "Description for Product 59",
//         code: "CODE59",
//         category: "Category 1",
//         price: 158,
//         stock: 158,
//         status: true,
//         thumbnail: ["hola"]
//     },
//     {
//         title: "Product 60",
//         description: "Description for Product 60",
//         code: "CODE60",
//         category: "Category 1",
//         price: 159,
//         stock: 159,
//         status: true,
//         thumbnail: ["hola"]
//     }
// ]);


