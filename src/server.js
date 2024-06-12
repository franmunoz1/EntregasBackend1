import express from 'express';
import { create } from 'express-handlebars';
import { Server as SocketIOServer } from 'socket.io';
import http from 'http';
import productsRouter from './routes/products.routes.js';
import cartRouter from './routes/cart.routes.js';
import viewsRouter from './routes/views.routes.js';

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server);

const PORT = 8080;

// Configurar Handlebars
const hbs = create({ extname: '.handlebars', defaultLayout: false });
app.engine('.handlebars', hbs.engine);
app.set('view engine', '.handlebars');
app.set('views', './src/views');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/products', productsRouter);
app.use('/api/carts', cartRouter);
app.use('/', viewsRouter);

// Configurar WebSocket
io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');

    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Middleware para compartir la instancia de io
app.use((req, res, next) => {
    req.io = io;
    next();
});
