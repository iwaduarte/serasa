import crypto from "crypto";
import { DataTypes, Model, ModelDefined, Sequelize } from "sequelize";
import { UserAttributes, UserCreationAttributes } from "./types.js";

const SALT_LENGTH = 16;

const hashPassword = (password: string): Promise<string> => {
  const salt = crypto.randomBytes(SALT_LENGTH).toString("hex");
  return new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) reject(err);
      resolve(`${salt}:${derivedKey.toString("hex")}`);
    });
  });
};

const verifyPassword = (password: string, hash: string): Promise<boolean> => {
  const [salt, key] = hash.split(":");
  return new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) reject(err);
      resolve(key === derivedKey.toString("hex"));
    });
  });
};

const User = (
  sequelize: Sequelize,
  dataTypes: typeof DataTypes,
): ModelDefined<UserAttributes, UserCreationAttributes> => {
  return sequelize.define(
    "User",
    {
      username: {
        type: dataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      email: {
        type: dataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: dataTypes.STRING,
        allowNull: false,
      },
    },
    {
      hooks: {
        // Before creating the user, hash the password
        beforeCreate: async (user: Record<any, any>) => {
          user.password = await hashPassword(user.password);
        },

        // Before updating the user, if password is changed, hash the password
        beforeUpdate: async (user: Record<string, any>) => {
          if (user.changed("password")) {
            user.password = await hashPassword(user.password);
          }
        },
      },
    },
  );
};

export default User;

export { verifyPassword, hashPassword };
