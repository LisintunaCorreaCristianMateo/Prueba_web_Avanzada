import {DataTypes, Model} from "sequelize";
import {sequelize} from "../config/database.js";

export class Arbol extends Model{}

Arbol.init(
{
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    tipoArbol: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
    },
    precioUnitario: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            min: 0
        }
    },
    descuento100_300: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Descuento para compras entre 101 y 300 árboles (%)'
    },
    descuentoMas300: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Descuento para compras mayores a 300 árboles (%)'
    }
},
{
    sequelize, // conexion a db
    modelName: "Arbol", // nombre de la tabla
    tableName: "arboles", // nombre explícito de la tabla
    timestamps: true // ver cuando se creo o actualizo
}
)
