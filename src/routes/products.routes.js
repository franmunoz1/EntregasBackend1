import { Router } from 'express';
import { ProductManager } from '../manager/products.manager.js';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

const productManager = new ProductManager('./src/data/products.json');

//realizar un get para obtener todos los productos con ?limit

router.get('/', async (req, res) => {
    const { limit } = req.query;

    const gettedProducts = await productManager.getProducts();

    if (limit) {
        res.json(gettedProducts.slice(0, limit));
        return;
    }


    res.json(gettedProducts);
});

router.get('/:pid', async (req, res) => {
    const { pid } = req.params;

    const gettedProducts = await productManager.getProducts();

    const productFinded = gettedProducts.find((product) => product.id === pid);

    if (!productFinded) {
        res.status(404).send('Producto no encontrado');
        return;
    }

    res.json(productFinded);
});

router.post('/', async (req, res) => {

    const id = uuidv4();

    const { title, description, code, price, status, stock, category } = req.body;

    if (!id || !title || !description || !code || !price || !status || !stock || !category) {
        return res.status(400).json({
            message: "Revisar campos obligatorios",
        });
    }

    const gettedProducts = await productManager.getProducts();

    if (gettedProducts.find((prod) => prod.id === id)) {
        return res.status(400).json({
            message: "El producto ya existe",
        });
    }

    const product = {
        id,
        title,
        description,
        code,
        price,
        status,
        stock,
        category
    };

    const products = await productManager.addProduct(product);

    res.status(201).json({
        message: "Producto creado con exito",
    });

});

// Realizar el put del producto
router.put('/:pid', async (req, res) => {
    const { pid } = req.params;
    const { title, description, code, price, status, stock, category } = req.body;

    const gettedProducts = await productManager.getProducts();

    const product = gettedProducts.find((product) => product.id === pid);

    if (!product) {
        res.status(404).send('Producto no encontrado');
        return;
    }

    product.title = title;
    product.description = description;
    product.code = code;
    product.price = price;
    product.status = status;
    product.stock = stock;
    product.category = category;

    const products = await productManager.updateProduct(product, pid);

    res.json(product);
});

// Realizar el delete del producto con un id pasado por parametro
router.delete('/:pid', async (req, res) => {
    const { pid } = req.params;
    let productExist = false;

    const products = await productManager.getProducts();

    products.find((product) => {
        if (product.id === pid) {
            productExist = true;
        }
    });

    if (!productExist) {
        res.status(404).send('Producto no encontrado');
        return;
    }

    const productsWithoutDeleted = await productManager.deleteProduct(pid);

    res.send('Producto eliminado con exito');
});


export default router;