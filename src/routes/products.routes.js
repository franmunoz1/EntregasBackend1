import { Router } from 'express';
import { ProductManager } from '../manager/products.manager.js';
import { v4 as uuidv4 } from 'uuid';
import { io } from '../server.js'; // Importar la instancia de Socket.io

const router = Router();

const productManager = new ProductManager('./src/data/products.json');

router.get('/', async (req, res) => {
    const { limit } = req.query;
    const products = await productManager.getProducts();
    if (limit) {
        return res.json(products.slice(0, limit));
    }
    res.json(products);
});

router.get('/:pid', async (req, res) => {
    const { pid } = req.params;
    const products = await productManager.getProducts();
    const product = products.find(p => p.id === pid);
    if (!product) {
        return res.status(404).send('Producto no encontrado');
    }
    res.json(product);
});

router.post('/', async (req, res) => {
    const id = uuidv4();
    const { title, description, code, price, status, stock, category } = req.body;

    if (!title || !description || !code || !price || !status || !stock || !category) {
        return res.status(400).json({ message: 'Revisar campos obligatorios' });
    }

    const product = { id, title, description, code, price, status, stock, category };
    const products = await productManager.addProduct(product);

    io.emit('productList', products); // Emitir evento de actualización de productos

    res.status(201).json({ message: 'Producto creado con éxito' });
});

router.put('/:pid', async (req, res) => {
    const { pid } = req.params;
    const { title, description, code, price, status, stock, category } = req.body;
    const products = await productManager.getProducts();
    const productIndex = products.findIndex(p => p.id === pid);
    if (productIndex === -1) {
        return res.status(404).send('Producto no encontrado');
    }

    const updatedProduct = { id: pid, title, description, code, price, status, stock, category };
    products[productIndex] = updatedProduct;

    await productManager.writeFile(products);

    io.emit('productList', products); // Emitir evento de actualización de productos

    res.json(updatedProduct);
});

router.delete('/:pid', async (req, res) => {
    const { pid } = req.params;
    const products = await productManager.getProducts();
    const productIndex = products.findIndex(p => p.id === pid);
    if (productIndex === -1) {
        return res.status(404).send('Producto no encontrado');
    }

    products.splice(productIndex, 1);

    await productManager.writeFile(products);

    io.emit('productList', products); // Emitir evento de actualización de productos

    res.send('Producto eliminado con éxito');
});

export default router;
