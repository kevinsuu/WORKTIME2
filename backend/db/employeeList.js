const { DataTypes } = require("sequelize");
const { sequelize } = require("../models/dbModel");

const EmployeeList = sequelize.define(
  "EmployeeList",
  {
    employeeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    workNumber: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    moNumber: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    tableName: "employeeList",
    timestamps: false,
  }
);

const EmployeeListData = [
  {
    workNumber: "20240121001",
    employeeId: "113001",
    moNumber: "20240120001test",
  },
  {
    workNumber: "20240121001",
    employeeId: "113002",
    moNumber: "20240120001test",
  },
  {
    workNumber: "20240121001",
    employeeId: "113003",
    moNumber: "20240120001test",
  },
  {
    workNumber: "20240121002",
    employeeId: "113004",
    moNumber: "20240120002test",
  },
  {
    workNumber: "20240121002",
    employeeId: "113005",
    moNumber: "20240120002test",
  },
  {
    workNumber: "20240121002",
    employeeId: "113006",
    moNumber: "20240120002test",
  },
  {
    workNumber: "20240121003",
    employeeId: "113007",
    moNumber: "20240120003test",
  },
  {
    workNumber: "20240121003",
    employeeId: "113008",
    moNumber: "20240120003test",
  },
  {
    workNumber: "20240121003",
    employeeId: "113009",
    moNumber: "20240120003test",
  },
];

const afterSyncHandler = async () => {
  try {
    await Promise.all(
      EmployeeListData.map(async (employeeList) => {
        await EmployeeList.findOrCreate({
          where: { employeeId: employeeList.employeeId },
          defaults: {
            workNumber: employeeList.workNumber,
            moNumber: employeeList.moNumber,
          },
        });
      })
    );

    console.log("EmployeeList created successfully");
  } catch (error) {
    console.error("Error while creating EmployeeList:", error);
  }
};

EmployeeList.afterSync(afterSyncHandler);
module.exports = EmployeeList;
