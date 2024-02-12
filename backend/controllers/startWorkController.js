const Order = require("../db/order");
const DataBase = require("../models/dbModel");
const ListModel = require("../models/listModel");

const List = require("../db/list");
const { Sequelize } = require("sequelize");

class StartWorkController {
  constructor() {
    this.dataBase = DataBase;
  }

  async insertOrder(req, res) {
    try {
      const moNumber = req.body.moNumber.trim();
      const status = req.body.status;
      const OrderInfo = await Order.findOne({
        where: {
          moNumber: moNumber,
        },
      });
      if (!OrderInfo) {
        return res.status(404).json({ success: false, error: "找不到相關製令單號" });
      }
      const now = new Date();
      const today = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Taipei" }));
      const year = today.getFullYear().toString(); // 取得年份的後兩位
      const month = String(today.getMonth() + 1).padStart(2, "0"); // 月份補0
      const day = String(today.getDate()).padStart(2, "0"); // 日補0
      const timeFormat = `${year}${month}${day}`;
      let workNumber = "";
      const latestRecord = await List.findOne({
        where: {
          workNumber: {
            [Sequelize.Op.like]: `${timeFormat}%`,
          },
        },
        order: [["workNumber", "DESC"]],
      });

      if (latestRecord) {
        const lastWorkNumber = latestRecord.workNumber;
        const lastNumber = parseInt(lastWorkNumber.substring(8)); // 從最後一個 workNumber 中取得數字部分
        workNumber = `${timeFormat}${(lastNumber + 1).toString().padStart(3, "0")}`;
      } else {
        workNumber = `${timeFormat}001`;
      }
      const ListSchema = new ListModel(
        workNumber,
        OrderInfo.moNumber,
        OrderInfo.location,
        OrderInfo.productionLineId,
        OrderInfo.productNumber,
        OrderInfo.productName,
        OrderInfo.productSpecification,
        OrderInfo.expectedProductionQuantity,
        status,
        OrderInfo.completedQuantity,
        OrderInfo.remark,
        OrderInfo.productionHours
      );
      const newListRecord = await List.create({
        workNumber: ListSchema.workNumber,
        moNumber: ListSchema.moNumber,
        location: ListSchema.location,
        productionLineId: ListSchema.productionLineId,
        productNumber: ListSchema.productNumber,
        productName: ListSchema.productName,
        productSpecification: ListSchema.productSpecification,
        expectedProductionQuantity: ListSchema.expectedProductionQuantity,
        status: ListSchema.status,
        completedQuantity: ListSchema.completedQuantity,
        remark: ListSchema.remark,
        productionHours: ListSchema.productionHours,
      });
      return res.json({ success: true, newListRecord });
    } catch (error) {
      console.error("Error retrieving Lists from database:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

module.exports = new StartWorkController();
