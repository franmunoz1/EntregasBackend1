import { Router } from 'express';

const router = Router();

const products = [];
let id = 1;
let status = true;

//realizar un get para obtener todos los productos con ?limit

router.get('/', (req, res) => {
    const { limit } = req.query;
    if (limit) {
        res.json(products.slice(0, limit));
        return;
    }
    res.json(products);
});

router.get('/:id', (req, res) => {
    const { id } = req.params;
    const product = products[id];

    if (!product) {
        res.status(404).send('Product not found');
        return;
    }

    res.json(product);
});

router.post('/', (req, res) => {
    const { title, description, code, price, status, stock, category } = req.body;

    const product = {
        id: id,
        title,
        description,
        code,
        price,
        status,
        stock,
        category
    };

    id++;

    products.push(product);

    if (!id || !title || !description || !code || !price || !status || !stock || !category) {
        return res.status(400).json({
            message: "Username and full name are required",
        });
    }

    if (products.find((prod) => prod.id === id)) {
        return res.status(400).json({
            message: "id already exists",
        });
    }

    res.status(201).json({
        message: "Product created successfully",
    });

});

// Realizar el put del producto
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { title, description, code, price, status, stock, category } = req.body;

    const product = products.find((product) => product.id === +id);

    if (!product) {
        res.status(404).send('Product not found');
        return;
    }

    product.title = title;
    product.description = description;
    product.code = code;
    product.price = price;
    product.status = status;
    product.stock = stock;
    product.category = category;

    res.json(product);
});

// Realizar el delete del producto con un id pasado por parametro
router.delete('/:id', (req, res) => {
    const { id } = req.params;

    const productIndex = products.findIndex((product) => product.id === +id);

    if (productIndex === -1) {
        res.status(404).send('Product not found');
        return;
    }

    products.splice(productIndex, 1);

    res.send('Product deleted successfully');
});


export default router;