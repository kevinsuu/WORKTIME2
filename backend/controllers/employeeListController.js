const EmployeeList = require("../db/employeeList");
const DataBase = require("../models/dbModel");
const Employee = require("../db/employee");

class EmployeeListController {
  constructor() {
    this.dataBase = DataBase;
  }

  async getEmployeeList(req, res) {
    try {
      const moNumber = req.params.moNumber;
      const workNumber = req.params.workNumber;
      const employeeList = await EmployeeList.findAll({
        where: {
          moNumber: moNumber,
          workNumber: workNumber,
        },
        include: [Employee], // 关联 Employee 模型
        raw: true, // 返回原始数据，不包含嵌套对象
      });
      const formattedEmployeeList = employeeList.map((item) => ({
        id: item.id,
        employeeId: item.employeeId,
        workNumber: item.workNumber,
        moNumber: item.moNumber,
        employeeId: item["employee.id"], // 重命名字段
        employeeName: item["employee.name"], // 重命名字段
        startTime: item.startTime,
        endTime: item.endTime,
        sleepTime: item.sleepTime,
        totalTime: item.totalTime,
      }));

      return res.json({ success: true, employeeListsInfo: formattedEmployeeList });
    } catch (error) {
      console.error("Error retrieving EmployeeLists from database:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

module.exports = new EmployeeListController();
