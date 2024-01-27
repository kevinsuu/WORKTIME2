const EmployeeList = require("../db/employeeList");
const DataBase = require("../models/dbModel");

class EmployeeListController {
  constructor() {
    this.dataBase = DataBase;
  }

  async getEmployeeList(req, res) {
    try {
      const moNumber = req.parms.moNumber;
      const workNumber = req.parms.workNumber;
      const employeeList = await EmployeeList.findAll({
        where: {
          moNumber: moNumber,
          workNumber: workNumber,
        },
      });
      return res.json({ success: true, employeeListsInfo: employeeList });
    } catch (error) {
      console.error("Error retrieving EmployeeLists from database:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

module.exports = new EmployeeListController();
