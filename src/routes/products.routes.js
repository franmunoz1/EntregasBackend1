import { Router } from 'express';
import { ProductManager } from '../manager/products.manager.js';
import { v4 as uuidv4 } from 'uuid';

const router = Router();
const productManager = new ProductManager('./src/data/products.json');

// Obtener todos los productos
router.get('/', async (req, res) => {
    const { limit } = req.query;
    const products = await productManager.getProducts();
    if (limit) {
        res.json(products.slice(0, limit));
        return;
    }
    res.json(products);
});

// Obtener un producto por id
router.get('/:pid', async (req, res) => {
    const { pid } = req.params;
    const products = await productManager.getProducts();
    const product = products.find(p => p.id === pid);
    if (!product) {
        res.status(404).send('Producto no encontrado');
        return;
    }
    res.json(product);
});

// Crear un nuevo producto
router.post('/', async (req, res) => {
    const id = uuidv4();
    const { title, description, code, price, status, stock, category } = req.body;
    if (!title || !description || !code || !price || !status || !stock || !category) {
        res.status(400).json({ message: "Revisar campos obligatorios" });
        return;
    }
    const product = { id, title, description, code, price, status, stock, category };
    await productManager.addProduct(product);
    req.io.emit('productListUpdated', await productManager.getProducts());
    res.status(201).json({ message: "Producto creado con éxito" });
});

// Actualizar un producto
router.put('/:pid', async (req, res) => {
    const { pid } = req.params;
    const { title, description, code, price, status, stock, category } = req.body;
    const products = await productManager.getProducts();
    const productIndex = products.findIndex(p => p.id === pid);
    if (productIndex === -1) {
        res.status(404).send('Producto no encontrado');
        return;
    }
    const product = { ...products[productIndex], title, description, code, price, status, stock, category };
    await productManager.updateProduct(product, pid);
    req.io.emit('productListUpdated', await productManager.getProducts());
    res.json(product);
});

// Eliminar un producto
router.delete('/:pid', async (req, res) => {
    const { pid } = req.params;
    const products = await productManager.getProducts();
    const productIndex = products.findIndex(p => p.id === pid);
    if (productIndex === -1) {
        res.status(404).send('Producto no encontrado');
        return;
    }
    await productManager.deleteProduct(pid);
    req.io.emit('productListUpdated', await productManager.getProducts());
    res.send('Producto eliminado con éxito');
});

export default router;
