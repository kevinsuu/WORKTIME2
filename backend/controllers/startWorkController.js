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
      const today = new Date();
      const year = today.getFullYear().toString(); // 取得年份的後兩位
      const month = String(today.getMonth() + 1).padStart(2, "0"); // 月份補0
      const day = String(today.getDate()).padStart(2, "0"); // 日補0
      const timeFormat = `${year}${month}${day}`;
      let workNumber = "";
      const ListInfo = await List.findOne({
        workNumber: {
          [Sequelize.Op.like]: timeFormat,
        },
      });
      if (ListInfo) {
        const numberOfRecords = await List.count({
          where: {
            workNumber: {
              [Sequelize.Op.like]: "20240127%",
            },
          },
        });

        workNumber = "20240127" + (numberOfRecords + 1).toString().padStart(3, "0");
      } else {
        workNumber = "20240127001";
      }
      console.log(OrderInfo);
      const ListSchema = new ListModel(
        workNumber,
        OrderInfo.moNumber,
        OrderInfo.location,
        OrderInfo.productionLineCode,
        OrderInfo.productionLineName,
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
        productionLineCode: ListSchema.productionLineCode,
        productionLineName: ListSchema.productionLineName,
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
