import {DataTypes, Model} from "sequelize";
import {sequelize} from "../config/database.js";

export class Cliente extends Model{
    calcularInteres(){
        const monto = this.montoCredito;
        let interes = 0;
        let tasaInteres = 0;
        
        if(monto < 50000) {
            tasaInteres = 3; // 3%
            interes = monto * 0.03;
        } else {
            tasaInteres = 2; // 2%
            interes = monto * 0.02;
        }

        const montoTotal = monto + interes;
        
        return { tasaInteres, interes, montoTotal };
    }
}
//definir atributos para cliente
//id, nombre, montoCredito
Cliente.init(
{    id:{type:DataTypes.INTEGER,primaryKey:true,autoIncrement:true},
    nombre:{type:DataTypes.STRING(80),allowNull:false},
    montoCredito:{type:DataTypes.FLOAT,allowNull:false},
},
{   sequelize,//conexion a db
    modelName:"Cliente", //nombre la tabla
    timestamps:true //ver cuando se creo o actualizo
}
)