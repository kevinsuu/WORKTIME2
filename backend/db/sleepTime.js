const { DataTypes } = require("sequelize");
const { sequelize } = require("../models/dbModel");

const SleepTime = sequelize.define(
  "sleepTime",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    values: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
  },
  {
    tableName: "sleepTime",
    timestamps: false,
  }
);

const afterSyncHandler = async () => {
  try {
    await SleepTime.findOrCreate({
      where: {
        values: 1,
      },
    });
  } catch (error) {
    console.error("Error while creating sleepTime:", error);
  }
};

SleepTime.afterSync(afterSyncHandler);
module.exports = SleepTime;
