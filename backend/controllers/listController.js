const List = require("../db/list");
const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");
const { allEmployeeCompleteWork } = require("./employeeListController");
const EmployeeList = require("../db/employeeList");

const DataBase = require("../models/dbModel");

class ListController {
  constructor() {
    this.dataBase = DataBase;
    this.getCompleteList = this.getCompleteList.bind(this);
    this.getList = this.getList.bind(this);
  }
  async formattedMultiList(lists) {
    const formatList = lists.map((item) => ({
      workNumber: item.workNumber,
      moNumber: item.moNumber,
      location: item.location,
      productionLineId: item.productionLineId,
      productNumber: item.productNumber,
      productName: item.productName,
      productSpecification: item.productSpecification,
      expectedProductionQuantity: item.expectedProductionQuantity,
      status: item.status,
      completedQuantity: item.completedQuantity,
      remark: item.remark,
      productionHours: item.productionHours,
      productionLineName: item.productionLineName,
      productionLineCode: item.productionLineCode,
    }));
    return formatList;
  }

  async getList(req, res) {
    try {
      const Lists = await DataBase.query(
        `
        SELECT * FROM "lists"
        JOIN "productLine" ON "lists"."productionLineId" = "productLine"."id"
        WHERE  "lists"."status" != '完成'
        ORDER BY "lists"."workNumber" ASC
      `,
        {}
      );
      const responseData = await this.formattedMultiList(Lists);

      return res.json({ success: true, listsInfo: responseData });
    } catch (error) {
      console.error("Error retrieving Lists from database:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
  async getCompleteList(req, res) {
    try {
      const Lists = await DataBase.query(
        `
        SELECT * FROM "lists"
        JOIN "productLine" ON "lists"."productionLineId" = "productLine"."id"
        WHERE  "lists"."status" = '完成'
        ORDER BY "lists"."workNumber" ASC
      `,
        {}
      );
      const responseData = await this.formattedMultiList(Lists);

      return res.json({ success: true, listsInfo: responseData });
    } catch (error) {
      console.error("Error retrieving Lists from database:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
  async getListInfo(req, res) {
    try {
      const Lists = await DataBase.query(
        `
        SELECT * FROM "lists"
        JOIN "productLine" ON "lists"."productionLineId" = "productLine"."id"
        WHERE  "lists"."workNumber" = :workNumber
        ORDER BY "lists"."workNumber" ASC
      `,
        { workNumber: req.params.id }
      );
      if (!Lists) {
        return res.status(404).json({ error: "List not found" });
      }
      const formatList = {
        workNumber: Lists[0].workNumber,
        moNumber: Lists[0].moNumber,
        location: Lists[0].location,
        productionLineId: Lists[0].productionLineId,
        productNumber: Lists[0].productNumber,
        productName: Lists[0].productName,
        productSpecification: Lists[0].productSpecification,
        expectedProductionQuantity: Lists[0].expectedProductionQuantity,
        status: Lists[0].status,
        completedQuantity: Lists[0].completedQuantity,
        remark: Lists[0].remark,
        productionHours: Lists[0].productionHours,
        productionLineName: Lists[0].productionLineName,
        productionLineCode: Lists[0].productionLineCode,
      };
      return res.json({ success: true, listsInfo: formatList });
    } catch (error) {
      console.error("Error retrieving Lists from database:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
  async searchListInfo(req, res) {
    try {
      const responeList = [];
      const Lists = await DataBase.query(
        `
        SELECT * FROM "lists"
        JOIN "productLine" ON "lists"."productionLineId" = "productLine"."id"
        WHERE ( "lists"."workNumber" = :params
        OR "lists"."moNumber" = :params)
        AND status != '完成'
        ORDER BY "lists"."workNumber" ASC
      `,
        { params: req.params.id }
      );
      if (!Lists || Lists.length === 0) {
        return res.status(404).json({ error: "List not found" });
      }

      Lists.forEach((list) => {
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
          productionLineName: list.productionLineName,
          productionLineCode: list.productionLineCode,
        };
        responeList.push(formatList);
      });
      return res.json({ success: true, listsInfo: responeList });
    } catch (error) {
      console.error("Error retrieving Lists from database:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async exportExcel(req, res) {
    const formatDateString = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0"); // 月份从0开始，需要加1
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}${month}${day}`;
    };

    try {
      const startTime = new Date(req.body.startTime);
      const endTime = new Date(req.body.endTime);
      const formattedStartTime = formatDateString(startTime);
      const formattedEndTime = formatDateString(endTime);
      const wb = XLSX.utils.book_new();

      const Lists = await DataBase.query(
        `
        SELECT * 
        FROM "lists"
        JOIN "productLine" ON "lists"."productionLineId" = "productLine"."id"
        WHERE "lists"."workNumber" BETWEEN :startTime AND :endTime
        AND "lists"."status" = '完成'
        ORDER BY "lists"."workNumber" ASC;
        `,
        {
          startTime: formattedStartTime,
          endTime: formattedEndTime,
        }
      );
      const wsData = [
        [
          "報工號碼",
          "製令單號",
          "報工狀態",
          "廠別",
          "生產線代號",
          "生產線名稱",
          "產品編號",
          "產品名稱",
          "產品規格",
          "預計生產數量",
          "狀態",
          "完成數量",
          "備註",
          "生產總工時",
        ],
      ];
      Lists.forEach((item) => {
        const rowData = [
          item.workNumber,
          item.moNumber,
          item.status,
          item.location,
          item.productionLineId,
          item.productionLineName,
          item.productNumber,
          item.productName,
          item.productSpecification,
          item.expectedProductionQuantity,
          item.status,
          item.completedQuantity,
          item.remark,
          item.productionHours,
        ];
        wsData.push(rowData);
      });

      const ws = XLSX.utils.aoa_to_sheet(wsData);

      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

      const currentDate = new Date();

      const fileName = `報工資料_${currentDate.getFullYear()}${currentDate.getMonth() + 1}${currentDate.getDate()}.xlsx`;

      const filePath = path.join(__dirname, fileName);
      XLSX.writeFile(wb, filePath);

      res.download(filePath, fileName, (err) => {
        if (err) {
          console.error("Error downloading file:", err);
          res.status(500).json({ error: "An error occurred while downloading file" });
        } else {
          fs.unlinkSync(filePath);
        }
      });
    } catch (err) {
      console.error("Error exporting Excel:", err);
      res.status(500).json({ error: "An error occurred while exporting Excel file" });
    }
  }

  async deleteCompleteList(req, res) {
    try {
      const Lists = await DataBase.query(
        `
        SELECT * FROM "lists"
        JOIN "productLine" ON "lists"."productionLineId" = "productLine"."id"
        WHERE  "lists"."workNumber" = :workNumber
        AND "lists"."status" = '完成'
        ORDER BY "lists"."workNumber" ASC
      `,
        { workNumber: req.params.id }
      );
      if (!Lists) {
        return res.status(404).json({ error: "List not found" });
      }
      const employeeList = await EmployeeList.findOne({ where: { workNumber: req.params.id } });
      if (Lists) {
        await DataBase.query(
          `
          DELETE FROM "lists"
          WHERE  "lists"."workNumber" = :workNumber
          AND "lists"."status" = '完成'
        `,
          { workNumber: req.params.id }
        );
      }
      if (employeeList) {
        await employeeList.destroy();
      }
      const responseData = await DataBase.query(
        `
        SELECT * FROM "lists"
        JOIN "productLine" ON "lists"."productionLineId" = "productLine"."id"
        WHERE 
         "lists"."status" = '完成'
        ORDER BY "lists"."workNumber" ASC
      `,
        {}
      );
      return res.json({ success: true, response: "工單已刪除", listsInfo: responseData });
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
        return res.status(400).json({ response: "工單尚無員工，無法完工" });
      }

      const totalTimeList = employeeList.map((employee) => parseFloat(employee.dataValues.totalTime));
      const totalProductionHours = totalTimeList.reduce((total, time) => total + time, 0).toFixed(3);

      const remark = req.body.remark;
      const completedQuantity = req.body.completedQuantity;
      const status = req.body.status;
      if (isNaN(completedQuantity)) {
        // If completedQuantity is not a valid number
        return res.status(400).json({ response: "完成數量數值需為數字" });
      }
      const [updatedRowsCount] = await List.update(
        { productionHours: totalProductionHours, remark, completedQuantity, status },
        { where: { workNumber: req.params.id } }
      );
      if (updatedRowsCount > 0) {
        const list = await List.findOne({ where: { workNumber: req.params.id } });

        return res.json({ success: true, listsInfo: list });
      } else {
        return res.status(404).json({ response: "找不到工單" });
      }
    } catch (error) {
      console.error("Error retrieving Lists from database:", error);
      return res.status(400).json({ response: "工單狀態更新失敗" });
    }
  }
}

module.exports = new ListController();
