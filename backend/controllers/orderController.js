const Order = require("../db/order");
const DataBase = require("../models/dbModel");
const ProductLine = require("../db/productLine");

class OrderController {
  constructor() {
    this.dataBase = DataBase;
  }

  async getOrder(req, res) {
    try {
      const Orders = await Order.findAll({ include: [ProductLine] });
      const formatList = Orders.map((item) => ({
        moNumber: item.moNumber,
        location: item.location,
        productionLineId: item.productionLineId,
        productionLineName: item.productLine ? item.productLine.productionLineName : "",
        productionLineCode: item.productLine ? item.productLine.productionLineCode : "",
        productNumber: item.productNumber || "",
        productName: item.productName || "",
        productSpecification: item.productSpecification || "",
        expectedProductionQuantity: item.expectedProductionQuantity || "",
      }));
      return res.json({ success: true, ordersInfo: formatList });
    } catch (error) {
      console.error("Error retrieving Orders from database:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

module.exports = new OrderController();
