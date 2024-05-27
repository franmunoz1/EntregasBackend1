import { Router } from 'express';

const router = Router();

const cart = [];

router.get('/', (req, res) => {
    res.json(cart);
});

router.get('/:cid', (req, res) => {
    const { id } = req.params;
    const cartItem = cart.find((cart) => cart.id === id);

    if (!cartItem) {
        res.status(404).send('Cart not found');
        return;
    }

    res.json(cartItem);
});

// La ruta POST  /:cid/product/:pid deberá agregar el producto al arreglo “products” del carrito seleccionado, agregándose como un objeto bajo el siguiente formato:
//product: SÓLO DEBE CONTENER EL ID DEL PRODUCTO (Es crucial que no agregues el producto completo), quantity: debe contener el número de ejemplares de dicho producto. El producto, de momento, se agregará de uno en uno.

router.post('/:cid/product/:pid', (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    const cartItem = cart.find((cart) => cart.id === cid);

    if (!cartItem) {
        res.status(404).send('Cart not found');
        return;
    }

    const product = {
        id: pid,
        quantity
    };

    cartItem.products.push(product);

    res.json(product);
});

// La ruta POST debera crear un nuevo carrito
router.post('/', (req, res) => {
    const { id } = req.body;

    const newCart = {
        id,
        products: []
    };

    cart.push(newCart);

    res.json(newCart);
});

export default router;