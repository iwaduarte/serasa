import { Sequelize } from "sequelize";
import "../dotenv";

const sequelize = new Sequelize(process.env.DATABASE_URL as string, {
  dialect: "postgres",
});

export default sequelize;
