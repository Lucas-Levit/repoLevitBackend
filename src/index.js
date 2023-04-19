import express from 'express'
import productRouter from './router/product.routes.js'
import multer from 'multer'
import { __dirname } from './path.js'
import cartRouter from "./router/cart.routes.js"


//Configuraciones
const app = express()
const PORT = 4000
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'src/public/img')
    },
    filename: (req, file, cb) => {
        cb(null, `${file.originalname}`)
    }
})

//Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
const upload = (multer({ storage: storage }))

//Routes
app.use('/products', productRouter)
app.use("/cart", cartRouter);
app.use('/static', express.static(__dirname + '/public'))
app.post('/upload', upload.single('product'), (req, res) => {
    //Imagenes
    console.log(req.body)
    console.log(req.file)
    res.send("Imagen subida")
})

app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`)
})