const { DataTypes } = require("sequelize");
const { sequelize } = require("../models/dbModel");

const Password = sequelize.define(
  "password",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    values: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    execution: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "passwords",
    timestamps: false,
  }
);

const afterSyncHandler = async () => {
  try {
    // Check if "home" record exists
    const homeRecord = await Password.findOne({
      where: {
        id: 1,
      },
    });

    // If "home" record does not exist, create it
    if (!homeRecord) {
      await Password.create({
        values: "1234",
        execution: "home",
      });
    }

    // Check if "work" record exists
    const workRecord = await Password.findOne({
      where: {
        id: 2,
      },
    });

    // If "work" record does not exist, create it
    if (!workRecord) {
      await Password.create({
        values: "1234",
        execution: "work",
      });
    }
  } catch (error) {
    console.error("Error while creating passwords:", error);
  }
};

Password.afterSync(afterSyncHandler);
module.exports = Password;
