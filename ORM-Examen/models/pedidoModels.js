import {DataTypes, Model} from "sequelize";
import {sequelize} from "../config/database.js";
import {Arbol} from "./arbolModels.js";

export class Pedido extends Model{
    async calcularTotal(){
        // Obtener información del árbol asociado
        const arbol = await Arbol.findByPk(this.arbolId);
        
        if(!arbol) {
            throw new Error('Árbol no encontrado');
        }

        const tipoArbol = arbol.tipoArbol;
        const cantidad = this.cantidad;
        const precioUnitario = parseFloat(arbol.precioUnitario);
        let subtotal = 0;
        let porcentajeDescuento = 0;
        let descuento = 0;
        let descuentoAdicional = 0;
        let subtotalConDescuento = 0;
        const IVA_PORCENTAJE = 0.15; // 15% de IVA
        let iva = 0;
        let total = 0;

        subtotal = precioUnitario * cantidad;

       
        if (cantidad > 100 && cantidad <= 300) {
            porcentajeDescuento = parseFloat(arbol.descuento100_300);
        } else if (cantidad > 300) {
            porcentajeDescuento = parseFloat(arbol.descuentoMas300);
        }

        // Calcular descuento
        descuento = subtotal * (porcentajeDescuento / 100);
        subtotalConDescuento = subtotal - descuento;

        // Verificar descuento adicional
        if (cantidad > 1000) {
            descuentoAdicional = subtotalConDescuento * 0.15; // 15% adicional
            subtotalConDescuento -= descuentoAdicional;
        }

        iva = subtotalConDescuento * IVA_PORCENTAJE;
        
        total = subtotalConDescuento + iva;

        return {
            tipoArbol,
            cantidad,
            precioUnitario: precioUnitario.toFixed(2),
            subtotal: subtotal.toFixed(2),
            porcentajeDescuento,
            descuento: descuento.toFixed(2),
            descuentoAdicional: descuentoAdicional.toFixed(2),
            subtotalConDescuento: subtotalConDescuento.toFixed(2),
            iva: iva.toFixed(2),
            total: total.toFixed(2)
        };
    }
}

// Definir atributos para Pedido
// id, arbolId, cantidad, clienteNombre (opcional)
Pedido.init(
{
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    arbolId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'arboles',
            key: 'id'
        }
    },
    cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1
        }
    },
    clienteNombre: {
        type: DataTypes.STRING(100),
        allowNull: false,
    }
},
{
    sequelize, // conexion a db
    modelName: "pedidos", // nombre de la tabla
 
    timestamps: true // ver cuando se creo o actualizo
}
)

// Definir relaciones
Pedido.belongsTo(Arbol, {
    foreignKey: 'arbolId',
    as: 'arbol'
});

Arbol.hasMany(Pedido, {
    foreignKey: 'arbolId',
    as: 'pedidos'
});
