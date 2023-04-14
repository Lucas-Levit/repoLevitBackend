import { promises as fs } from "fs";

export class ProductManager {
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
        const txt = await fs.readFile(this.path, "utf-8");
        return txt;
    }

    async getProductById(id) {
        try {
            const prodsJSON = await fs.readFile(this.path, "utf-8");
            const prods = JSON.parse(prodsJSON);
            if (prods.some((prod) => prod.id === parseInt(id))) {
                return prods.find((prod) => prod.id === parseInt(id));
            } else {
                return "Producto no encontrado";
            }
        } catch (error) {
            console.error("Error al leer el archivo JSON:", error);
            return "Error al leer el archivo JSON";
        }
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
const cereales = new Products("Cereales", "Cereales de chocolate", 300, "img", "GX", 100)
const cafe = new Products("Cafe", "Cafe instantaneo", 900, "img", "CD", 100)
const leche = new Products("Leche", "Leche descremada", 150, "img", "LLS", 100)
const cacao = new Products("Cacao", "Caco nesquick", 350, "img", "NQ", 100)
const fideos = new Products("Fideos", "Fideos Mostacholes", 100, "img", "FM", 100)
const arroz = new Products("Arroz", "Arroz largo fino", 180, "img", "AG", 100)
const atun = new Products("Atun", "Atun", 400, "img", "ALC", 100)


const productManager1 = new ProductManager("./info.txt")
productManager1.addProduct(pan)
productManager1.addProduct(galletitas)
productManager1.addProduct(queso)
productManager1.addProduct(mermelada)
productManager1.addProduct(cereales)
productManager1.addProduct(cafe)
productManager1.addProduct(leche)
productManager1.addProduct(cacao)
productManager1.addProduct(fideos)
productManager1.addProduct(arroz)
productManager1.addProduct(atun)





productManager1.getProduct()
// productManager1.updateProduct(1, "title", "jalea")
// productManager1.deleteProduct(2)
