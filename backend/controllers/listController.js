const List = require("../db/list");
const DataBase = require("../models/dbModel");

class ListController {
  constructor() {
    this.dataBase = DataBase;
  }

  async getList(req, res) {
    try {
      const Lists = await List.findAll();
      res.json({ success: true, ListsInfo: Lists });
    } catch (error) {
      console.error("Error retrieving Lists from database:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

module.exports = new ListController();
