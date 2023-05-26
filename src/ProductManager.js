import { MongoClient, ObjectId } from "mongodb";

export class ProductManager {
    constructor(uri, dbName, collectionName) {
        this.uri = uri;
        this.dbName = dbName;
        this.collectionName = collectionName;
    }

    async getProducts() {
        const client = await MongoClient.connect(this.uri);
        const collection = client.db(this.dbName).collection(this.collectionName);
        const products = await collection.find().toArray();
        client.close();
        return products;
    }

    async getProductById(id) {
        const client = await MongoClient.connect(this.uri);
        const collection = client.db(this.dbName).collection(this.collectionName);
        const product = await collection.findOne({ _id: ObjectId(id) });
        client.close();
        return product;
    }

    async addProduct(product) {
        try {
            if (!product.title || product.title === "") {
                console.log("Faltan datos de título");
                return "Faltan datos de título";
            }
            if (!product.description || product.description === "") {
                console.log("Faltan datos de descripción");
                return "Faltan datos de descripción";
            }
            if (!product.price || product.price === "") {
                console.log("Faltan datos de precio");
                return "Faltan datos de precio";
            }
            if (!product.code || product.code === "") {
                console.log("Faltan datos de código");
                return "Faltan datos de código";
            }
            if (product.status === "") {
                product.status = true;
            }
            if (!product.stock || product.stock === "") {
                console.log("Faltan datos de stock");
                return "Faltan datos de stock";
            }
            if (!product.category || product.category === "") {
                console.log("Faltan datos de categoría");
                return "Faltan datos de categoría";
            }

            const client = await MongoClient.connect(this.uri);
            const collection = client.db(this.dbName).collection(this.collectionName);

            const productoRepetido = await collection.findOne({ code: product.code });

            if (productoRepetido) {
                console.log("Ya existe un producto con este código");
                return "Ya existe un producto con este código";
            } else {
                await collection.insertOne(product);
                client.close();
                return null;
            }
        } catch (error) {
            console.error(error);
            return error;
        }
    }
    async updateProduct(
        id,
        { title, description, price, thumbnail, code, status, stock, category }
    ) {
        try {
            const client = await MongoClient.connect(this.uri);
            const collection = client.db(this.dbName).collection(this.collectionName);

            if (await collection.findOne({ _id: ObjectId(id) })) {
                await collection.updateOne(
                    { _id: ObjectId(id) },
                    {
                        $set: {
                            title,
                            description,
                            price,
                            thumbnail,
                            code,
                            status,
                            stock,
                            category,
                        },
                    }
                );
                client.close();
                return "Producto actualizado";
            } else {
                return "Producto no encontrado";
            }
        } catch (error) {
            return error;
        }
    }

    async deleteProduct(id) {
        try {
            const client = await MongoClient.connect(this.uri);
            const collection = client.db(this.dbName).collection(this.collectionName);

            if (await collection.findOne({ _id: new ObjectId(id) })) {
                await collection.deleteOne({ _id: new ObjectId(id) });
                client.close();
                return "Producto eliminado";
            } else {
                return "Producto no encontrado";
            }
        } catch (error) {
            return error;
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
