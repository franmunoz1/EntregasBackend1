import { Router } from 'express';
import { CartManager } from '../manager/carts.manager.js';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

const cartManager = new CartManager('./src/data/carts.json');

router.get('/', async (req, res) => {

    const carts = await cartManager.getCarts();

    res.json(carts);
});

// La ruta POST debera crear un nuevo carrito
router.post('/', async (req, res) => {

    const id = uuidv4();

    const cart = {
        id,
        products: []
    };

    const newCart = await cartManager.createCart(cart);

    res.status(201).json(newCart);
});

router.get('/:cid', async (req, res) => {
    const { cid } = req.params;

    const carts = await cartManager.getCarts();

    const cartItem = carts.find((cart) => cart.id === cid);

    if (!cartItem) {
        res.status(404).send('Carrito no encontrado');
        return;
    }

    res.json(cartItem);

});


router.post('/:cid/product/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    const carts = await cartManager.getCarts();

    const cartItem = carts.find((cart) => cart.id === cid);

    if (!cartItem) {
        res.status(404).send('Carrito no encontrado');
        return;
    }

    //agregar validacion para si no existe el producto

    const newCart = await cartManager.addToCart(cid, pid, quantity);

    res.json(newCart);
});

export default router;