import { promises as fs } from 'fs'

export class CartManager {
    constructor(path) {
        this.path = path
        this.counter = 1
    }
    generateId() {
        product.id = this.counter.length + 1
    }

    async createCarrito() {
        const cartsJSON = await fs.readFile(this.path, 'utf-8')
        const carts = JSON.parse(cartsJSON)
        const carrito = {
            id: CartManager.generateId(),
            cantidad: []
        }
        carts.push(carrito)
        await fs.writeFile(this.path, JSON.stringify(carts))
        return "Carrito creado"
    }

    async getCartById(id) {
        const cartsJSON = await fs.readFile(this.path, 'utf-8')
        const carts = JSON.parse(cartsJSON)
        if (carts.some(cart => cart.id === parseInt(id))) {
            return carts.find(cart => cart.id === parseInt(id))
        } else {
            return "Carrito no encontrado"
        }
    }

    async addProductCart(id, quantity, idCart) {
        try {
            const cartsJSON = await fs.readFile(this.path, "utf-8");
            const carts = JSON.parse(cartsJSON);
            const carrito = carts.find((cart) => cart.id === parseInt(idCart));
            if (carrito.some((product) => product.id === parseInt(id))) {
                const productIndex = carrito.findIndex(
                    (product) => product.id === parseInt(id)
                );
                carrito[productIndex] += parseInt(quantity);
            } else {
                const newProduct = { id: parseInt(id), quantity: parseInt(quantity) };
                carrito.quantity.push(newProduct);
            }
            const cartIndex = carts.findIndex((cart) => cart.id === parseInt(idCart));
            carts[cartIndex] = carrito;
            await fs.writeFile(this.path, JSON.stringify(carts));
        } catch (error) {
            return error;
        }
    }
}
