import { promises as fs } from "fs";

export class ProductManager {
    constructor(path) {
        this.path = path
        this.Products = []
    }

    async addProduct(product) {
        try {
            if (!product.title || product.title === "") return console.log("Faltan datos de title");
            if (!product.description || product.description === "") return console.log("Faltan datos de description");
            if (!product.price || product.price === "") return console.log("Faltan datos de precio");
            if (!product.code || product.code === "") return console.log("Faltan datos de code");
            if (!product.status || product.status === "") return product.status = true;
            if (!product.stock || product.stock === "") return console.log("Faltan datos de stock");
            if (!product.category || product.category === "") return console.log("Faltan datos de category")

            const prodsJSON = await fs.readFile(this.path, "utf-8");
            const prods = JSON.parse(prodsJSON);
            const productoRepetido = prods.some((productCargado) => productCargado.code === product.code)
            if (productoRepetido) { return console.log("hay productos repetidos") }
            else {
                const prodsJSON = await fs.readFile(this.path, "utf-8");
                const prods = JSON.parse(prodsJSON);
                product.id = prods.length + 1
                prods.push(product)
                await fs.writeFile(this.path, JSON.stringify(prods));
                console.log("Producto creado")
                return null
            }
        }
        catch (error) {
            console.error(error);
        }
    }
    // async reescribirTxt(word) {
    //     await fs.writeFile(this.path, "");
    //     await fs.writeFile(this.path, JSON.stringify(this.Products));
    //     console.log(`producto ${word} exitosamente`);
    // }

    async getProducts() {
        const txt = await fs.readFile(this.path, 'utf-8')
        return JSON.parse(txt)
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

    async updateProduct(id, { title, description, price, thumbnail, code, stock, status, category }) {
        const productJSON = await fs.readFile(this.path, 'utf-8')
        const prods = JSON.parse(productJSON)
        if (prods.some(product => product.id === parseInt(id))) {
            let index = prods.findIndex(product => product.id === parseInt(id))
            prods[index].title = title
            prods[index].description = description
            prods[index].price = price
            prods[index].thumbnail = thumbnail
            prods[index].code = code
            prods[index].status = status
            prods[index].stock = stock
            prods[index].category = category
            await fs.writeFile(this.path, JSON.stringify(prods))
            return "Producto actualizado"
        } else {
            return "Producto no encontrado"
        }
    }

    async deleteProduct(id) {
        try {
            const productJSON = await fs.readFile(this.path, 'utf-8')
            const prods = JSON.parse(productJSON)
            if (prods.some(product => product.id === parseInt(id))) {
                const productosFiltrados = prods.filter(product => product.id !== parseInt(id))
                await fs.writeFile(this.path, JSON.stringify(productosFiltrados))
                return "Producto eliminado"
            } else {
                return "Producto no encontrado"
            }
        }
        catch {
            console.log("");
        }
    }
}

class Products {
    constructor(title, description, price, thumbnail, code, status, category, stock) {
        this.title = title
        this.description = description
        this.price = price
        this.thumbnail = thumbnail
        this.code = code
        this.status = status
        this.category = category
        this.stock = stock
    }
}



