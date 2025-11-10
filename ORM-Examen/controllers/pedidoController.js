import {Pedido} from "../models/pedidoModels.js";
import {Arbol} from "../models/arbolModels.js";

// Controlador para crear pedido de árboles
export const crearPedido = async(req, res) => {
    try {
        const {arbolId, cantidad, clienteNombre} = req.body;
        
        // Validación de datos obligatorios
        if(!arbolId || cantidad == null || cantidad === undefined) {
            return res.status(400).json({message: "Faltan datos obligatorios: arbolId y cantidad"});
        }
        
        // Verificar que el árbol exista
        const arbol = await Arbol.findByPk(arbolId);
        if(!arbol) {
            return res.status(404).json({message: "Árbol no encontrado. Use un arbolId válido"});
        }
        
        // Validación de cantidad como número
        if(typeof cantidad !== 'number' || isNaN(cantidad)) {
            return res.status(400).json({message: "La cantidad debe ser un número válido"});
        }
        
        // Validación de cantidad negativa
        if(cantidad < 0) {
            return res.status(400).json({message: "La cantidad no puede ser negativa"});
        }
        
        // Validación de cantidad cero
        if(cantidad === 0) {
            return res.status(400).json({message: "La cantidad debe ser mayor a cero"});
        }
        
        // Validación de cantidad máxima razonable
        if(cantidad > 100000) {
            return res.status(400).json({message: "La cantidad no puede ser mayor a 100,000 árboles"});
        }
        
        // Crear pedido
        const nuevoPedido = await Pedido.create({arbolId, cantidad, clienteNombre});
        
        // Obtener el pedido con la información del árbol
        const pedidoCompleto = await Pedido.findByPk(nuevoPedido.id, {
            include: [{
                model: Arbol,
                as: 'arbol'
            }]
        });
        
        res.status(201).json(pedidoCompleto);
    } catch(error) {
        console.error("Error al crear pedido:", error);
        res.status(500).json({message: "Error del servidor"});
    }
};

// Listar todos los pedidos
export const listarPedidos = async(req, res) => {
    try {
        const pedidos = await Pedido.findAll({
            include: [{
                model: Arbol,
                as: 'arbol'
            }]
        });
        res.json(pedidos);
    } catch(error) {
        console.error("Error al listar pedidos:", error);
        res.status(500).json({message: "Error del servidor"});
    }
};

// Buscar pedido por ID
export const obtenerPedido = async(req, res) => {
    try {
        const pedido = await Pedido.findByPk(req.params.id, {
            include: [{
                model: Arbol,
                as: 'arbol'
            }]
        });
        if(!pedido) {
            return res.status(404).json({message: "Pedido no encontrado"});
        }
        res.json(pedido);
    } catch(error) {
        console.error("Error al buscar pedido:", error);
        res.status(500).json({message: "Error del servidor"});
    }
};

// Actualizar pedido
export const actualizarPedido = async(req, res) => {
    try {
        const pedido = await Pedido.findByPk(req.params.id);
        if(!pedido) {
            return res.status(404).json({mensaje: "Pedido no encontrado"});
        }
        const {arbolId, cantidad, clienteNombre} = req.body;
        
        // Si se actualiza el arbolId, verificar que exista
        if(arbolId) {
            const arbol = await Arbol.findByPk(arbolId);
            if(!arbol) {
                return res.status(404).json({mensaje: "Árbol no encontrado"});
            }
        }
        
        await pedido.update({arbolId, cantidad, clienteNombre});
        
        // Obtener el pedido actualizado con la información del árbol
        const pedidoActualizado = await Pedido.findByPk(pedido.id, {
            include: [{
                model: Arbol,
                as: 'arbol'
            }]
        });
        
        res.json(pedidoActualizado);
    } catch(error) {
        res.status(500).json({mensaje: "Error al actualizar el pedido", error: error.message});
    }
};

// Eliminar pedido
export const eliminarPedido = async(req, res) => {
    try {
        const pedido = await Pedido.findByPk(req.params.id);
        if(!pedido) {
            return res.status(404).json({mensaje: "Pedido no encontrado"});
        }
        await pedido.destroy();
        res.json({mensaje: "Pedido eliminado correctamente"});
    } catch(error) {
        res.status(500).json({mensaje: "Error al eliminar el pedido", error: error.message});
    }
};

// Calcular total del pedido
export const calcularTotal = async(req, res) => {
    try {
        const pedido = await Pedido.findByPk(req.params.id);
        if(!pedido) {
            return res.status(404).json({message: "Pedido no encontrado"});
        }
        
        // Calcular automáticamente según el tipo de árbol y cantidad
        const resultado = await pedido.calcularTotal();
        
        res.json({
            id: pedido.id,
            tipoArbol: resultado.tipoArbol,
            cantidad: resultado.cantidad,
            precioUnitario: `$${resultado.precioUnitario}`,
            subtotal: `$${resultado.subtotal}`,
            porcentajeDescuento: `${resultado.porcentajeDescuento}%`,
            descuento: `$${resultado.descuento}`,
            descuentoAdicional: `$${resultado.descuentoAdicional}`,
            subtotalConDescuento: `$${resultado.subtotalConDescuento}`,
            iva: `$${resultado.iva}`,
            total: `$${resultado.total}`
        });
    } catch(error) {
        res.status(500).json({message: "Error al calcular total", error: error.message});
    }
};
