const { DataTypes } = require("sequelize");
const { sequelize } = require("../models/dbModel");
const Employee = require("./employee"); // 导入 Employee 模型
const faker = require("faker");

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
    startTime: {
      type: DataTypes.TIME,
    },
    endTime: {
      type: DataTypes.TIME,
    },
    sleepTime: {
      type: DataTypes.TEXT,
    },
    totalTime: {
      type: DataTypes.TIME,
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
    startTime: faker.date.between("2020-01-01", "2024-02-07"),
    endTime: faker.date.between("2024-02-08", "2025-12-31"),
    sleepTime: "1",
    totalTime: faker.date.between("2024-02-08", "2025-12-31"),
  },
  {
    workNumber: "20240121001",
    employeeId: "113002",
    moNumber: "20240120001test",
    startTime: faker.date.past(),
    endTime: faker.date.future(),
    sleepTime: "1",
    totalTime: faker.date.future(),
  },
  {
    workNumber: "20240121001",
    employeeId: "113003",
    moNumber: "20240120001test",
    startTime: faker.date.past(),
    endTime: faker.date.future(),
    sleepTime: "1",
    totalTime: faker.date.future(),
  },
  {
    workNumber: "20240121002",
    employeeId: "113004",
    moNumber: "20240120006test",
    startTime: faker.date.past(),
    endTime: faker.date.future(),
    sleepTime: "1",
    totalTime: faker.date.future(),
  },
  {
    workNumber: "20240121002",
    employeeId: "113005",
    moNumber: "20240120006test",
    startTime: faker.date.past(),
    endTime: faker.date.future(),
    sleepTime: "1",
    totalTime: faker.date.future(),
  },
  {
    workNumber: "20240121002",
    employeeId: "113006",
    moNumber: "20240120006test",
    startTime: faker.date.past(),
    endTime: faker.date.future(),
    sleepTime: "1",
    totalTime: faker.date.future(),
  },
  {
    workNumber: "20240121003",
    employeeId: "113007",
    moNumber: "20240120005test",
    startTime: faker.date.past(),
    endTime: faker.date.future(),
    sleepTime: "1",
    totalTime: faker.date.future(),
  },
  {
    workNumber: "20240121003",
    employeeId: "113008",
    moNumber: "20240120005test",
    startTime: faker.date.past(),
    endTime: faker.date.future(),
    sleepTime: "1",
    totalTime: faker.date.future(),
  },
  {
    workNumber: "20240121003",
    employeeId: "113009",
    moNumber: "20240120005test",
    startTime: faker.date.past(),
    endTime: faker.date.future(),
    sleepTime: "1",
    totalTime: faker.date.future(),
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
            startTime: employeeList.startTime,
            endTime: employeeList.endTime,
            sleepTime: employeeList.sleepTime,
            totalTime: employeeList.totalTime,
          },
        });
      })
    );

    console.log("EmployeeList created successfully");
  } catch (error) {
    console.error("Error while creating EmployeeList:", error);
  }
};
EmployeeList.belongsTo(Employee, { foreignKey: "employeeId" });
EmployeeList.afterSync(afterSyncHandler);
module.exports = EmployeeList;
