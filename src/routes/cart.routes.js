import { Router } from 'express';
import { CartManager } from '../manager/carts.manager.js';

const router = Router();

const cart = [];
let id = 1;

const cartManager = new CartManager('./src/data/carts.json');

router.get('/', async (req, res) => {

    const carts = await cartManager.getCarts();

    res.json(carts);
});

// La ruta POST debera crear un nuevo carrito
router.post('/', async (req, res) => {

    const cart = {
        id: id,
        products: []
    };

    const newCart = await cartManager.createCart(cart);

    id++;

    res.status(201).json(newCart);
});

router.get('/:cid', async (req, res) => {
    const { cid } = req.params;

    const carts = await cartManager.getCarts();

    const cartItem = carts.find((cart) => cart.id === +cid);

    if (!cartItem) {
        res.status(404).send('Cart not found');
        return;
    }

    res.json(cartItem);

});


router.post('/:cid/product/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    const carts = await cartManager.getCarts();

    const cartItem = carts.find((cart) => cart.id === +cid);

    if (!cartItem) {
        res.status(404).send('Cart not found');
        return;
    }

    //agregar validacion para si no existe el producto

    const newCart = await cartManager.addToCart(+cid, +pid, quantity);

    res.json(newCart);
});

export default router;