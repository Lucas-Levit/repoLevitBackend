import { promises as fs } from "fs";

export class ProductManager {
    constructor(path) {
        this.path = path
        this.Products = []
    }
    async addProduct(product) {
        try {
            const prods = await this.getProducts();
            if (!product.title || product.title === "") { console.log("Faltan datos de title"); return "Faltan datos de title"; }
            if (!product.description || product.description === "") { console.log("Faltan datos de description"); return "Faltan datos de description" }
            if (!product.price || product.price === "") { console.log("Faltan datos de precio"); return "Faltan datos de precio" }
            if (!product.code || product.code === "") { console.log("Faltan datos de code"); return "Faltan datos de code" }
            if (product.status === "") product.status = true;
            if (!product.stock || product.stock === "") { console.log("Faltan datos de stock"); return "Faltan datos de stock" }
            if (!product.category || product.category === "") { console.log("Faltan datos de category"); return "Faltan datos de category" }

            const productoRepetido = prods.some((productCargado) => productCargado.code === product.code)
            if (productoRepetido) { console.log("hay productos repetidos"); return "hay productos repetidos" }
            else {
                product.id = ProductManager.incrementarID()
                prods.push(product)
                await this.reescribirTxt("creado", prods);
                return null
            }
        }
        catch (error) {
            console.error(error);
        }
    }
    static incrementarID() {
        if (this.idIncrement) {
            this.idIncrement++;
        } else {
            this.idIncrement = 1;
        }
        return this.idIncrement;
    }
    async reescribirTxt(word, prods) {
        try {
            await fs.writeFile(this.path, "");
            await fs.writeFile(this.path, JSON.stringify(prods));
            console.log(`producto ${word} exitosamente`);
        } catch (error) {
            console.error(error);
        }
    }

    async getProducts() {
        const txt = await fs.readFile(this.path, 'utf-8')
        return JSON.parse(txt)
    }

    async getProductById(id) {
        const prods = await this.getProducts();
        if (prods.some((prod) =>
            prod.id
            === parseInt(id))) {
            return prods.find((prod) =>
                prod.id
                === parseInt(id));
        } else {
            return false;
        }
    }

    async updateProduct(id, { title, description, price, thumbnail, code, stock, status, category }) {
        const prods = await this.getProducts();
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
            await this.reescribirTxt("Actualizado", prods);
            return "Producto actualizado"
        } else {
            return "Producto no encontrado"
        }
    }

    async deleteProduct(id) {
        try {
            const prods = await this.getProducts();
            if (prods.some(product => product.id === parseInt(id))) {
                const productosFiltrados = prods.filter(product => product.id !== parseInt(id))
                await this.reescribirTxt("eliminado", productosFiltrados);
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



