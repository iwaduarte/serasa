import { Sequelize, DataTypes } from "sequelize";
import loadModels from "./loadModels.js";
import "../dotenv.js";

const { DATABASE_URL } = process.env;

const sequelize = new Sequelize(process.env.DATABASE_URL as string, {
  dialect: "postgres",
  benchmark: true,
  // in production, you would want to set this to false
  logging: console.log,
});

const models = await loadModels(sequelize, DataTypes);

export default { sequelize, models };
