import {Router} from "express";
import {
    crarCliente, 
    listarClientes,
    obtenerCliente,
    actualizarCliente,
    eliminarCliente,
    calcularInteres
} from "../controllers/clienteController.js";

export const router = Router();

//definir rutas
router.post("/", crarCliente);
router.get("/", listarClientes);
router.get("/:id", obtenerCliente);
router.put("/:id", actualizarCliente);
router.delete("/:id", eliminarCliente);

//ruta para calcular el interés
router.get("/:id/interes", calcularInteres);

