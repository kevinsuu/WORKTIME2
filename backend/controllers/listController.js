const List = require("../db/list");
const EmployeeList = require("../db/employeeList");

const DataBase = require("../models/dbModel");

class ListController {
  constructor() {
    this.dataBase = DataBase;
  }

  async getList(req, res) {
    try {
      const Lists = await List.findAll();
      return res.json({ success: true, listsInfo: Lists });
    } catch (error) {
      console.error("Error retrieving Lists from database:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
  async getListInfo(req, res) {
    try {
      const list = await List.findOne({ where: { workNumber: req.params.id } });
      if (!list) {
        return res.status(404).json({ error: "List not found" });
      }
      return res.json({ success: true, listsInfo: list });
    } catch (error) {
      console.error("Error retrieving Lists from database:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
  async deleteList(req, res) {
    try {
      const list = await List.findOne({ where: { workNumber: req.params.id } });

      const employeeList = await EmployeeList.findOne({ where: { workNumber: req.params.id } });
      if (list) {
        await list.destroy();
      }
      if (employeeList) {
        await employeeList.destroy();
      }

      return res.json({ success: true, listsInfo: list });
    } catch (error) {
      console.error("Error retrieving Lists from database:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

module.exports = new ListController();
