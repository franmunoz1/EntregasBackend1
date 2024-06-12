import express from 'express';
import { create } from 'express-handlebars';
import { Server as SocketIOServer } from 'socket.io';
import http from 'http';
import { v4 as uuidv4 } from 'uuid';
import productsRouter from './routes/products.routes.js';
import cartRouter from './routes/cart.routes.js';
import viewsRouter from './routes/views.routes.js';
import { ProductManager } from './manager/products.manager.js'; // Asegúrate de importar el ProductManager

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server);

const PORT = 8080;
const productManager = new ProductManager('./src/data/products.json');

const hbs = create({ extname: '.handlebars', defaultLayout: false });
app.engine('.handlebars', hbs.engine);
app.set('view engine', '.handlebars');
app.set('views', './src/views');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    req.io = io;
    next();
});

// Rutas
app.use('/api/products', productsRouter);
app.use('/api/carts', cartRouter);
app.use('/', viewsRouter);

// Configurar WebSocket
io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');

    socket.on('addProduct', async (product) => {
        const newProduct = {
            id: uuidv4(),  // Generar un nuevo UUID para el id
            ...product
        };
        await productManager.addProduct(newProduct);
        const products = await productManager.getProducts();
        io.emit('productListUpdated', products); // Emitir evento a todos los clientes
    });

    socket.on('deleteProduct', async (productId) => {


        console.log("ELIMINARR", productId)
        await productManager.deleteProduct(productId);
        const products = await productManager.getProducts();
        io.emit('productListUpdated', products); // Emitir evento a todos los clientes
    });

    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
});

server.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});