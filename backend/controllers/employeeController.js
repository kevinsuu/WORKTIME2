const Employee = require("../db/employee");
const DataBase = require("../models/dbModel");

class EmployeeController {
  constructor() {
    this.dataBase = DataBase;
  }

  async getEmployee(req, res) {
    try {
      const employees = await Employee.findAll();
      return res.json({ success: true, employeesInfo: employees });
    } catch (error) {
      console.error("Error retrieving employees from database:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async setEmployee(req, res) {
    const employeeId = req.body.id;
    const employeeName = req.body.name;

    if (!employeeId && !employeeName) {
      console.error("employeeId is not set. Set a employeeId before saving to the database.");
      return res.status(400).json({ error: "Bad Request" });
    }

    try {
      const [employee, created] = await Employee.findOrCreate({
        where: { id: employeeId },
        defaults: { name: employeeName },
      });
      if (!created) {
        return res.json({ success: true, response: "Employee is exist" });
      } else {
        const newEmployeeData = employee.get({ plain: true });

        return res.json({ success: true, response: newEmployeeData });
      }
    } catch (error) {
      console.error("Error saving employee to database:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

module.exports = new EmployeeController();
