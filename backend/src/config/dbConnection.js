import { Sequelize } from "sequelize";
import dotenv from 'dotenv'
dotenv.config();

const sequelize = new Sequelize(
  process.env.DATABASE_NAME,
  process.env.DATABASE_USERNAME, 
  process.env.DATABASE_PASSWORD, 
  {
    host: 'localhost',
    dialect: 'mysql',
    logging: false,
  }
);

export default sequelize;

