import fs from 'fs/promises';

export class CartManager {
    constructor(path) {
        this.path = path;
    }

    getCarts = async () => {
        const data = await fs.readFile(this.path, 'utf8');
        const carts = await JSON.parse(data);
        return carts;
    }

    createCart = async (cart) => {
        const carts = await this.getCarts();
        carts.push(cart);
        await this.writeFile(carts);
        return carts;
    }

    findItem = async (id) => {
        const carts = await this.getProducts();
        const filteredCart = carts.find(cart => cart.id === id);
        if (filteredCart) {
            return filteredCart;
        }
    }

    addToCart = async (cartId, productId, quantity) => {
        const carts = await this.getProducts();
        const filteredCart = carts.find(cart => cart.id === cartId);

        if (filteredCart.products.some(prod => prod.product === productId)) {

            const filteredProduct = filteredCart.products.find(prod => prod.product === productId)
            filteredProduct.quantity++;

            await this.writeFile(carts)
            return filteredProduct;
        } else {

            filteredCart.products.push({
                product: productId,
                quantity
            })
            await this.writeFile(carts)
            return filteredCart;
        }

    }


}