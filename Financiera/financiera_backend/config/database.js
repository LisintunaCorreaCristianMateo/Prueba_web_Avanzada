// configurar Squilize
import { Sequelize } from "sequelize";
import dotenv from "dotenv";//trabaja con .env

dotenv.config();

export const sequelize =new Sequelize(
process.env.DB_NAME,
process.env.DB_USER,
process.env.DB_PASS,
{
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "mysql",
    logging: false,
    timezone: "-05:00", // Zona horaria de Ecuador (UTC-5)
    dialectOptions: {
        timezone: "-05:00"
    }
}
);
