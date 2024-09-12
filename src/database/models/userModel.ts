import { DataTypes, Model } from "sequelize";
import crypto from "crypto";
import sequelize from "../connection";
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

class User extends Model {
  public id!: number;
  public username!: string;
  public password!: string;
  public email!: string;
}

User.init(
  {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "User",
  },
);

User.beforeCreate(async (data: User) => {
  const password = await hashPassword(data.password);
  Object.assign(data, { password });
});

User.beforeUpdate(async (data: User) => {
  if (data.password && data.changed("password")) {
    const password = await hashPassword(data.password);
    Object.assign(data, { password });
  }
});

export default User;
export { verifyPassword, hashPassword };
