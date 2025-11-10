import {Arbol} from "../models/arbolModels.js";

// Crear nuevo tipo de árbol
export const crearArbol = async(req, res) => {
    try {
        const {tipoArbol, precioUnitario, descuento100_300, descuentoMas300} = req.body;
        
        // Validación de datos obligatorios
        if(!tipoArbol || precioUnitario == null) {
            return res.status(400).json({message: "Faltan datos obligatorios: tipoArbol y precioUnitario"});
        }
        
        // Validar que el tipo de árbol no esté vacío
        if(tipoArbol.trim() === "") {
            return res.status(400).json({message: "El tipo de árbol no puede estar vacío"});
        }
        
        // Validación de precio unitario
        if(typeof precioUnitario !== 'number' || precioUnitario <= 0) {
            return res.status(400).json({message: "El precio unitario debe ser un número mayor a cero"});
        }
        
        // Crear árbol
        const nuevoArbol = await Arbol.create({
            tipoArbol, 
            precioUnitario, 
            descuento100_300: descuento100_300 || 0,
            descuentoMas300: descuentoMas300 || 0
        });
        res.status(201).json(nuevoArbol);
    } catch(error) {
        console.error("Error al crear árbol:", error);
        if(error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({message: "Este tipo de árbol ya existe"});
        }
        res.status(500).json({message: "Error del servidor"});
    }
};

// Listar todos los árboles
export const listarArboles = async(req, res) => {
    try {
        const arboles = await Arbol.findAll();
        res.json(arboles);
    } catch(error) {
        console.error("Error al listar árboles:", error);
        res.status(500).json({message: "Error del servidor"});
    }
};

// Obtener árbol por ID
export const obtenerArbol = async(req, res) => {
    try {
        const arbol = await Arbol.findByPk(req.params.id);
        if(!arbol) {
            return res.status(404).json({message: "Árbol no encontrado"});
        }
        res.json(arbol);
    } catch(error) {
        console.error("Error al buscar árbol:", error);
        res.status(500).json({message: "Error del servidor"});
    }
};

// Actualizar árbol
export const actualizarArbol = async(req, res) => {
    try {
        const arbol = await Arbol.findByPk(req.params.id);
        if(!arbol) {
            return res.status(404).json({mensaje: "Árbol no encontrado"});
        }
        const {tipoArbol, precioUnitario, descuento100_300, descuentoMas300} = req.body;
        await arbol.update({tipoArbol, precioUnitario, descuento100_300, descuentoMas300});
        res.json(arbol);
    } catch(error) {
        res.status(500).json({mensaje: "Error al actualizar el árbol", error: error.message});
    }
};

// Eliminar árbol
export const eliminarArbol = async(req, res) => {
    try {
        const arbol = await Arbol.findByPk(req.params.id);
        if(!arbol) {
            return res.status(404).json({mensaje: "Árbol no encontrado"});
        }
        await arbol.destroy();
        res.json({mensaje: "Árbol eliminado correctamente"});
    } catch(error) {
        res.status(500).json({mensaje: "Error al eliminar el árbol", error: error.message});
    }
};
