const Order = require("../db/order");
const DataBase = require("../models/dbModel");

class OrderController {
  constructor() {
    this.dataBase = DataBase;
  }

  async getOrder(req, res) {
    try {
      console.log(req.body);
      const Orders = await Order.findAll();
      res.json({ success: true, ordersInfo: Orders });
    } catch (error) {
      console.error("Error retrieving Orders from database:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

module.exports = new OrderController();
