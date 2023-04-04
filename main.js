class ProductManager {
    constructor() {
        this.Products = []
    }
    addProduct(product) {
        if (!product.title || product.title === "") return console.log("Faltan datos");
        if (!product.description || product.description === "") return console.log("Faltan datos");
        if (!product.price || product.price === "") return console.log("Faltan datos");
        if (!product.code || product.code === "") return console.log("Faltan datos");
        if (!product.stock || product.stock === "") return console.log("Faltan datos");

    const productoRepetido =  this.Products.find((productCargado) => productCargado.code === product.code)
    if (productoRepetido) {return console.log("hay productos repetidos")}
    else {product.id = this.Products.length + 1
        this.Products.push(product)}
        
    }
    getProduct() {
        console.log(this.Products)
    }
    getProductById(id) {
        const product =this.Products.find((product) => product.id=== id)
        if (product) {return product}
        else {console.error("Product not found")}
    }
}


class Products {
    constructor(title, description, price, thumbnail, code, stock) {
        this.title = title
        this.description = description
        this.price = price
        this.thumbnail = thumbnail
        this.code = code
        this.stock = stock
    }
}
const pan = new Products("Pan lactal", "pan de molde lacteado", 250, "img", "PLB", 100)
const galletitas = new Products("Oreo", "galletitas dulces", 200, "img", "GAO", 100)
const queso = new Products("Queso Rallado", "queso parmesano", 500, "img", "QLAS", 100)
const mermelada = new Products("Mermelada", "Mermelada de frutilla", 600, "img", "MF", 100)

const productManager1 = new ProductManager ()
productManager1.addProduct(pan)
productManager1.addProduct(galletitas)
productManager1.addProduct(queso)
productManager1.addProduct (mermelada)

productManager1.getProduct()