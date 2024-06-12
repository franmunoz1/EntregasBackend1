import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { engine } from 'express-handlebars';
import productsRouter from './routes/products.routes.js';
import cartRouter from './routes/cart.routes.js';
import viewsRouter from './routes/views.routes.js'; // Nuevo router para las vistas

const app = express();
const server = createServer(app); // Crear servidor HTTP
const io = new Server(server); // Crear instancia de Socket.io

const PORT = 8080;

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './src/views'); // Establecer directorio de vistas

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/products', productsRouter);
app.use('/api/carts', cartRouter);
app.use('/', viewsRouter); // Usar router de vistas

io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export { io };
