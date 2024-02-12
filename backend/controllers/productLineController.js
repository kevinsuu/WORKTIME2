const ProductLine = require("../db/productLine");
const DataBase = require("../models/dbModel");

class ProductLineController {
  constructor() {
    this.dataBase = DataBase;
  }

  async getProductLine(req, res) {
    try {
      const productLine = await ProductLine.findAll();
      return res.json(productLine);
    } catch (error) {
      console.error("Error retrieving passwords from database:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

module.exports = new ProductLineController();
