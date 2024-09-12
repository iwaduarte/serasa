import { fileURLToPath, pathToFileURL } from "url";
import path from "path";
import fs from "fs";
import { Sequelize, DataTypes, ModelStatic, Model } from "sequelize";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Define the type for the models object
type ModelsType = {
  [key: string]: ModelStatic<Model> & {
    associate: (models: ModelsType) => void;
  };
};

const loadModels = async (
  sequelize: Sequelize,
  dataTypes: typeof DataTypes,
): Promise<ModelsType> => {
  if (!sequelize) throw new Error("Missing sequelize connection");

  // Read the model files from the models directory
  const files = fs
    .readdirSync(path.join(__dirname, "/models"))
    .filter(
      (file) =>
        file.indexOf(".") !== 0 &&
        file.slice(-3) === ".js" &&
        file.slice(-5) !== ".d.js",
    );

  let Models: ModelsType = {};

  // Dynamically import each model and initialize it
  await Promise.all(
    files.map(async (file) => {
      const { default: modelFn } = await import(
        pathToFileURL(path.join(__dirname, "/models", file)).toString()
      );

      const model = modelFn(sequelize, dataTypes);
      Models[model.name] = model;
    }),
  );

  // Setup associations between models if they exist
  Object.keys(Models).forEach((key: string) => {
    if ("associate" in Models[key]) {
      Models[key].associate(Models);
    }
  });

  return Models;
};

export default loadModels;
