import SequelizeObject from "./connect.js";

const { sequelize } = SequelizeObject;

sequelize
  .sync({ alter: true })
  .then(() => console.log("Database synced"))
  .catch((err) => console.error("Error connecting to the database", err));
