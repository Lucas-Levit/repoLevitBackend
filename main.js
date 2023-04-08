import { promises as fs } from "fs";

class ProductManager {
    constructor(path) {
        this.path = path
        this.Products = []
    }

    async addProduct(product) {
        if (!product.title || product.title === "") return console.log("Faltan datos");
        if (!product.description || product.description === "") return console.log("Faltan datos");
        if (!product.price || product.price === "") return console.log("Faltan datos");
        if (!product.code || product.code === "") return console.log("Faltan datos");
        if (!product.stock || product.stock === "") return console.log("Faltan datos");

        const productoRepetido = this.Products.find((productCargado) => productCargado.code === product.code)
        if (productoRepetido) { return console.log("hay productos repetidos") }
        else {
            product.id = this.Products.length + 1
            this.Products.push(product)
            try { this.reescribirTxt("cargado") }
            catch (error) { return error }
        }
    }
    async reescribirTxt(word) {
        await fs.writeFile(this.path, JSON.stringify(this.Products)); 
        console.log(`producto ${word} exitosamente`);
    }
    async getProduct() {
        console.log(this.Products)
    }
    async getProductById(id) {
        const product = this.Products.find((product) => product.id === id)
        if (product) { return product }
        else { console.error("Product not found") }
    }

    async updateProduct(id, campo, valor) {
        const product = this.Products.find((product) => product.id === id);
        if (product) {
            product[campo] = valor;
            try {
                this.reescribirTxt("actualizado");
            } catch (error) {
                return error;
            }
        } else {
            console.log("Producto no encontrado");
        }
    }
    async deleteProduct(id) {
        const index = this.Products.findIndex((product) => product.id === id);
        if (index !== -1) {
            this.Products.splice(index, 1);
            const prod = this.Products;
            console.log(prod);
        try {
            await fs.writeFile(this.path, "");
            this.reescribirTxt("eliminado");
        } catch (error) {
            return error;
        }
        } else {
        console.log("Producto no encontrado");
        }
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

const productManager1 = new ProductManager("./info.txt")
productManager1.addProduct(pan)
productManager1.addProduct(galletitas)
productManager1.addProduct(queso)
productManager1.addProduct(mermelada)


productManager1.getProduct()
productManager1.updateProduct(1, "title", "jalea")
productManager1.deleteProduct(2)
