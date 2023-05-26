import { MongoClient, ObjectId } from "mongodb";

export class CartManager {
    constructor(uri, dbName, collectionName) {
        this.uri = uri;
        this.dbName = dbName;
        this.collectionName = collectionName;
    }

    async getCarts() {
        const client = await MongoClient.connect(this.uri);
        const collection = client.db(this.dbName).collection(this.collectionName);
        const carts = await collection.find().toArray();
        client.close();
        return carts;
    }

    async createCarrito(data) {
        const client = await MongoClient.connect(this.uri);
        const collection = client.db(this.dbName).collection(this.collectionName);
        const newCart = { products: data };
        await collection.insertOne(newCart);
        client.close();
    }

    async addProductCart(id, quantity, idCart) {
        try {
            const client = await MongoClient.connect(this.uri);
            const db = client.db(this.dbName);
            const collection = db.collection(this.collectionName);
            const cart = await collection.findOne({ _id: ObjectId(idCart) });
            const productIndex = cart.products.findIndex(
                (product) => product.id === parseInt(id)
            );
            if (productIndex !== -1) {
                cart.products[productIndex].quantity += parseInt(quantity);
            } else {
                const newProduct = {
                    id: parseInt(id),
                    quantity: parseInt(quantity),
                };
                cart.products.push(newProduct);
            }
            await collection.updateOne({ _id: ObjectId(idCart) }, { $set: cart });
            client.close();
            return "Producto agregado al carrito";
        } catch (error) {
            return error;
        }
    }
}
