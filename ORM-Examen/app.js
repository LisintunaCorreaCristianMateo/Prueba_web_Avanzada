import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { sequelize } from './config/database.js';
import { arbolRouter } from './routes/arbolRoutes.js';
import { pedidoRouter } from './routes/pedidoRoutes.js';
dotenv.config();

const app = express();
// Middleware (para manejar JSON y CORS)
app.use(cors());
app.use(express.json());
// ruta raiz
app.get('/', (_req, res) => res.send('Servidor del Criadero de Árboles funcionando correctamente'));   
// Rutas
app.use('/api/arboles', arbolRouter);
app.use('/api/pedidos', pedidoRouter);

//iniciar servidor

const iniciarServidor = async () => {
    try {
        await sequelize.authenticate();
        console.log('✓ Conexión a la base de datos establecida correctamente');
        
        await sequelize.sync(); 
        console.log('✓ Modelos sincronizados con la base de datos');
        
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => console.log(`✓ Servidor ejecutándose en el puerto ${PORT}`));
    } catch (error) {
        console.error('Error al conectar con la base de datos:', error.message);
        console.error('Detalles del error:', error);
    }
};

iniciarServidor();