import {Router} from "express";
import {
    crearPedido,
    listarPedidos,
    obtenerPedido,
    actualizarPedido,
    eliminarPedido,
    calcularTotal
} from "../controllers/pedidoController.js";

export const pedidoRouter = Router();

// Rutas para Pedidos
pedidoRouter.post("/", crearPedido);             // Crear nuevo pedido
pedidoRouter.get("/", listarPedidos);            // Listar todos los pedidos
pedidoRouter.get("/:id", obtenerPedido);         // Obtener pedido por ID
pedidoRouter.put("/:id", actualizarPedido);      // Actualizar pedido
pedidoRouter.delete("/:id", eliminarPedido);     // Eliminar pedido

// Ruta para calcular el total del pedido
pedidoRouter.get("/:id/calcular", calcularTotal);
