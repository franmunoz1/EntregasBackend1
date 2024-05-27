import fs from 'fs/promises';

export class ProductManager {
    constructor(path) {
        this.path = path;
    }

    //products
    getProducts = async () => {
        const data = await fs.readFile(this.path, 'utf8');
        const products = await JSON.parse(data);
        return products;
    }

    writeFile = async (data) => {
        const items = JSON.stringify(data, null, "\t");
        return await fs.writeFile(this.path, items, 'utf8');
    }

    addProduct = async (data) => {
        const products = await this.getProducts();
        const newProduct = data;
        products.push(newProduct);
        await this.writeFile(products);
        return products;
    }

    updateProduct = async (data, productId) => {
        const products = await this.getProducts();
        const newProduct = data;
        const productIndex = products.findIndex(prod => prod.id === productId);
        products[productIndex] = newProduct;
        await this.writeFile(products);
        return products;
    }

    deleteProduct = async (productIndex) => {
        const products = await this.getProducts();
        const productsWithoutDeleted = products.filter(prod => prod.id !== productIndex);
        await this.writeFile(productsWithoutDeleted);
        return productsWithoutDeleted;
    }
}