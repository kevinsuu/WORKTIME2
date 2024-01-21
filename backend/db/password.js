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
    // Add "home" record
    await Password.findOrCreate({
      where: {
        values: "1234",
        execution: "home",
      },
    });

    // Add "work" record
    await Password.findOrCreate({
      where: {
        values: "1234",
        execution: "work",
      },
    });
  } catch (error) {
    console.error("Error while creating passwords:", error);
  }
};

Password.afterSync(afterSyncHandler);
module.exports = Password;
