import express from 'express';
import productsRouter from './routes/products.routes.js';
import cartRouter from './routes/cart.routes.js';

const app = express();

const PORT = 8080;

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

app.use('/api/products', productsRouter);
app.use('/api/cart', cartRouter);