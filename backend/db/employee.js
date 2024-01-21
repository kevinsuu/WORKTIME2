const { DataTypes } = require("sequelize");
const { sequelize } = require("../models/dbModel");

const Employee = sequelize.define(
  "employee",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    tableName: "employees",
    timestamps: false,
  }
);

const employeesData = [
  { name: "張小明", id: "113001" },
  { name: "陳美玲", id: "113002" },
  { name: "劉大偉", id: "113003" },
  { name: "吳靜怡", id: "113004" },
  { name: "李宗翰", id: "113005" },
  { name: "林雅琪", id: "113006" },
  { name: "王志明", id: "113007" },
  { name: "黃小雨", id: "113008" },
  { name: "許家豪", id: "113009" },
  { name: "鄭佳慧", id: "113010" },
];

const afterSyncHandler = async () => {
  try {
    await Promise.all(
      employeesData.map(async (employee) => {
        await Employee.findOrCreate({
          where: { id: employee.id },
          defaults: { name: employee.name },
        });
      })
    );

    console.log("Employees created successfully");
  } catch (error) {
    console.error("Error while creating Employees:", error);
  }
};

Employee.afterSync(afterSyncHandler);
module.exports = Employee;
