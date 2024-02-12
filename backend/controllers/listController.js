const List = require("../db/list");
const ProductLine = require("../db/productLine");
const { Op } = require("sequelize");
const { allEmployeeCompleteWork } = require("./employeeListController");
const EmployeeList = require("../db/employeeList");

const DataBase = require("../models/dbModel");

class ListController {
  constructor() {
    this.dataBase = DataBase;
  }

  async getList(req, res) {
    try {
      const Lists = await DataBase.query(
        `
        SELECT * FROM "lists"
        JOIN "productLine" ON "lists"."productionLineId" = "productLine"."id"
        WHERE  "lists"."status" != '完成'
        ORDER BY "lists"."workNumber" DESC
      `
      );
      console.log(Lists);

      return res.json({ success: true, listsInfo: Lists });
    } catch (error) {
      console.error("Error retrieving Lists from database:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async getListInfo(req, res) {
    try {
      const list = await List.findOne({ where: { workNumber: req.params.id }, include: [ProductLine] });
      if (!list) {
        return res.status(404).json({ error: "List not found" });
      }

      const formatList = {
        workNumber: list.workNumber,
        moNumber: list.moNumber,
        location: list.location,
        productionLineId: list.productionLineId,
        productNumber: list.productNumber,
        productName: list.productName,
        productSpecification: list.productSpecification,
        expectedProductionQuantity: list.expectedProductionQuantity,
        status: list.status,
        completedQuantity: list.completedQuantity,
        remark: list.remark,
        productionHours: list.productionHours,
        productionLineName: list.productLine.productionLineName,
        productionLineCode: list.productLine.productionLineCode,
      };

      return res.json({ success: true, listsInfo: formatList });
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
  async updateListInfo(req, res) {
    try {
      const employeeList = await allEmployeeCompleteWork(req.params.id);
      if (employeeList.length == 0) {
        return res.status(400).json({ respone: "工單尚無員工，無法完工" });
      }

      const totalTimeList = employeeList.map((employee) => parseFloat(employee.dataValues.totalTime));
      const totalProductionHours = totalTimeList.reduce((total, time) => total + time, 0);

      const remark = req.body.remark;
      const completedQuantity = req.body.completedQuantity;
      const status = req.body.status;
      if (isNaN(completedQuantity)) {
        // If completedQuantity is not a valid number
        return res.status(400).json({ respone: "完成數量數值需為數字" });
      }
      const [updatedRowsCount] = await List.update(
        { productionHours: totalProductionHours, remark, completedQuantity, status },
        { where: { workNumber: req.params.id } }
      );
      if (updatedRowsCount > 0) {
        const list = await List.findOne({ where: { workNumber: req.params.id } });

        return res.json({ success: true, listsInfo: list });
      } else {
        return res.status(404).json({ respone: "找不到工單" });
      }
    } catch (error) {
      console.error("Error retrieving Lists from database:", error);
      return res.status(400).json({ respone: "工單狀態更新失敗" });
    }
  }
}

module.exports = new ListController();
