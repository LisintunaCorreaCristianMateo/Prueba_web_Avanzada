import {Router} from "express";
import {
    crearArbol,
    listarArboles,
    obtenerArbol,
    actualizarArbol,
    eliminarArbol
} from "../controllers/arbolController.js";

export const arbolRouter = Router();

// Rutas para Árboles
arbolRouter.post("/", crearArbol);              // Crear nuevo tipo de árbol
arbolRouter.get("/", listarArboles);            // Listar todos los árboles
arbolRouter.get("/:id", obtenerArbol);          // Obtener árbol por ID
arbolRouter.put("/:id", actualizarArbol);       // Actualizar árbol
arbolRouter.delete("/:id", eliminarArbol);      // Eliminar árbol
