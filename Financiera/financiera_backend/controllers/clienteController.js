import {Cliente} from "../models/clientesModels.js";
//controlador para crear cliente
export const crarCliente=async(req,res)=>{
    try{
        const {nombre,montoCredito}=req.body;
        
        //validación 1: Campos obligatorios
        if(!nombre || montoCredito == null || montoCredito === undefined){
            return res.status(400).json({message:"Faltan datos obligatorios: nombre y montoCredito"});
        }
        
        //validación 2: Nombre no vacío
        if(nombre.trim() === ""){
            return res.status(400).json({message:"El nombre no puede estar vacío"});
        }
        
        //validación 3: Monto debe ser número
        if(typeof montoCredito !== 'number' || isNaN(montoCredito)){
            return res.status(400).json({message:"El monto del crédito debe ser un número válido"});
        }
        
        //validación 4: No puede ser negativo
        if(montoCredito < 0){
            return res.status(400).json({message:"El monto del crédito no puede ser negativo"});
        }
        
        //validación 5: No puede ser cero
        if(montoCredito === 0){
            return res.status(400).json({message:"El monto del crédito debe ser mayor a cero"});
        }
        
        //validación 6: Monto máximo
        if(montoCredito > 500000){
            return res.status(400).json({message:"El monto del crédito no puede ser mayor a $500,000"});
        }
        
        //crear cliente
        const nuevoCliente=await Cliente.create({nombre,montoCredito});
        res.status(201).json(nuevoCliente);
    }catch(error){
        console.error("Error al crear cliente:",error);
        res.status(500).json({message:"Error del servidor"});
    }
};
//listar
export const listarClientes=async(req,res)=>{
    try{
        const clientes=await Cliente.findAll();
        res.json(clientes);
    }catch(error){
        console.error("Error al listar clientes:",error);
        res.status(500).json({message:"Error del servidor"});
    }
};
//buscar 
export const obtenerCliente=async(req,res)=>{
    try{
         const cliente = await Cliente.findByPk(req.params.id);
        if(!cliente){
            return res.status(404).json({message:"Cliente no encontrado"});
        }
        res.json(cliente);
    }catch(error){
        console.error("Error al buscar cliente:",error);
        res.status(500).json({message:"Error del servidor"});
    }
};
//actualizar
export const actualizarCliente = async(req, res) => {
    try {
        const cliente = await Cliente.findByPk(req.params.id);
        if(!cliente){
            return res.status(404).json({mensaje: "Cliente no encontrado"});
        }
        const {nombre, montoCredito} = req.body;
        await cliente.update({nombre, montoCredito});
        res.json(cliente);
    }
    catch(error){
        res.status(500).json({mensaje: "Error al actualizar el cliente", error: error.message});
    }
};

//eliminar
export const eliminarCliente = async(req, res) => {
    try {
        const cliente = await Cliente.findByPk(req.params.id);
        if(!cliente){
            return res.status(404).json({mensaje: "Cliente no encontrado"});
        }
        await cliente.destroy();
        res.json({mensaje: "Cliente eliminado correctamente"});
    } catch(error){
        res.status(500).json({mensaje: "Error al eliminar el cliente", error: error.message});
    }
};
//Calcular interes
export const calcularInteres=async(req,res)=>{
    try{
        const cliente=await Cliente.findByPk(req.params.id);
        if(!cliente){
            return res.status(404).json({message:"Cliente no encontrado"});
        }
        
        // Calcular automáticamente según el montoCredito
        const resultado = cliente.calcularInteres();
        
        res.json({
            id: cliente.id,
            nombre: cliente.nombre,
            montoCredito: cliente.montoCredito,
            tasaInteres: resultado.tasaInteres,
            interes: resultado.interes,
            montoTotal: resultado.montoTotal
        });
    }catch(error){
        res.status(500).json({message:"Error al calcular interes", error:error.message});
    }
};