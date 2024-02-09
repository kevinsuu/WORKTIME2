const EmployeeList = require("../db/employeeList");
const DataBase = require("../models/dbModel");
const Employee = require("../db/employee");
const SleepTime = require("../db/sleepTime");
const { Op } = require("sequelize");
const { sl } = require("date-fns/locale");
const { en } = require("faker/lib/locales");

class EmployeeListController {
  constructor() {
    this.dataBase = DataBase;
    this.getEmployeeList = this.getEmployeeList.bind(this);
    this.addEmployeeList = this.addEmployeeList.bind(this);
    this.singleEmployeeStartWork = this.singleEmployeeStartWork.bind(this);
    this.allEmployeeStartWork = this.allEmployeeStartWork.bind(this);
    this.singleDeleteEmployee = this.singleDeleteEmployee.bind(this);
    this.singleCompleteEmployee = this.singleCompleteEmployee.bind(this);
  }
  async formattedEmployeeList(moNumber, workNumber) {
    const employeeList = await EmployeeList.findAll({
      where: {
        moNumber: moNumber,
        workNumber: workNumber,
      },
      include: [Employee], // 关联 Employee 模型
      raw: true, // 返回原始数据，不包含嵌套对象
    });

    const formatList = employeeList.map((item) => ({
      id: item.id,
      employeeId: item.employeeId,
      workNumber: item.workNumber,
      moNumber: item.moNumber,
      employeeId: item["employee.id"] || "",
      employeeName: item["employee.name"] || "",
      startTime: item.startTime || "",
      endTime: item.endTime || "",
      sleepTime: item.sleepTime || "",
      totalTime: item.totalTime || "",
    }));
    return formatList;
  }
  async addEmployeeList(req, res) {
    const employeeId = req.params.employeeId;
    const moNumber = req.params.moNumber;
    const workNumber = req.params.workNumber;
    console.log(moNumber, workNumber, employeeId);
    if (!employeeId) {
      console.error("employeeId is not set. Set a employeeId before saving to the database.");
      return res.status(400).json({ error: "Bad Request" });
    }

    try {
      const existingEmployee = await EmployeeList.findOne({
        where: {
          employeeId: employeeId,
          [Op.or]: [{ moNumber: { [Op.ne]: null } }, { workNumber: { [Op.ne]: null } }],
        },
      });

      if (existingEmployee) {
        const employeeListData = existingEmployee.get({ plain: true });
        const [employeeList, created] = await EmployeeList.findOrCreate({
          where: { employeeId: employeeId, moNumber: moNumber, workNumber: workNumber },
        });

        if (!created) {
          return res.json({ success: false, response: "員工已存在" });
        } else {
          return res.json({
            success: true,
            response: "員工已存在於其他工單中",
            employeeListData: await this.formattedEmployeeList(moNumber, workNumber),
          });
        }
      }

      const [employeeList, created] = await EmployeeList.findOrCreate({
        where: { employeeId: employeeId, moNumber: moNumber, workNumber: workNumber },
      });
      if (!created) {
        return res.json({ success: false, response: "員工已經存在" });
      } else {
        return res.json({
          success: true,
          employeeListData: await this.formattedEmployeeList(moNumber, workNumber),
        });
      }
    } catch (error) {
      console.error("Error saving employeeList to database:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
  async getEmployeeList(req, res) {
    try {
      const moNumber = req.params.moNumber;
      const workNumber = req.params.workNumber;

      return res.json({ success: true, employeeListsInfo: await this.formattedEmployeeList(moNumber, workNumber) });
    } catch (error) {
      console.error("Error retrieving EmployeeLists from database:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
  async allEmployeeStartWork(req, res) {
    try {
      const moNumber = req.params.moNumber;
      const workNumber = req.params.workNumber;
      const employeeList = await EmployeeList.findAll({
        where: {
          moNumber: moNumber,
          workNumber: workNumber,
        },
      });

      for (const item of employeeList) {
        if (!item.startTime) {
          const now = new Date();
          const hours = now.getHours().toString().padStart(2, "0"); // 補齊數字至兩位數，不足的話前面補 0
          const minutes = now.getMinutes().toString().padStart(2, "0");
          const seconds = now.getSeconds().toString().padStart(2, "0");
          const startTime = `${hours}:${minutes}:${seconds}`;
          item.startTime = startTime; // 將日期時間對象轉換為 ISO 字符串
          await item.save();
        }
      }
      return res.json({ success: true, response: "工單成員皆已開工", employeeListsInfo: await this.formattedEmployeeList(moNumber, workNumber) });
    } catch (error) {
      console.error("Error updating start time for all employees:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
  async singleEmployeeStartWork(req, res) {
    try {
      const moNumber = req.params.moNumber;
      const workNumber = req.params.workNumber;
      const employeeId = req.params.employeeId;
      const employeeList = await EmployeeList.findOne({
        where: {
          moNumber: moNumber,
          workNumber: workNumber,
          employeeId: employeeId,
        },
      });
      if (!employeeList) {
        return res.status(404).json({ error: "Employee not found" });
      }
      if (!employeeList.startTime) {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, "0");
        const minutes = now.getMinutes().toString().padStart(2, "0");
        const seconds = now.getSeconds().toString().padStart(2, "0");
        const startTime = `${hours}:${minutes}:${seconds}`;
        employeeList.startTime = startTime;
        await employeeList.save();
      }
      return res.json({ success: true, response: "成員已開工", employeeListsInfo: await this.formattedEmployeeList(moNumber, workNumber) });
    } catch (error) {
      console.error("Error updating start time for all employees:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
  async singleDeleteEmployee(req, res) {
    try {
      const moNumber = req.params.moNumber;
      const workNumber = req.params.workNumber;
      const employeeId = req.params.employeeId;
      const employeeList = await EmployeeList.findOne({
        where: {
          moNumber: moNumber,
          workNumber: workNumber,
          employeeId: employeeId,
        },
      });
      if (!employeeList) {
        return res.status(404).json({ error: "Employee not found" });
      }
      await employeeList.destroy();

      return res.json({ success: true, response: "成員已刪除", employeeListsInfo: await this.formattedEmployeeList(moNumber, workNumber) });
    } catch (error) {
      console.error("Error updating start time for all employees:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
  async singleCompleteEmployee(req, res) {
    try {
      const moNumber = req.params.moNumber;
      const workNumber = req.params.workNumber;
      const employeeId = req.params.employeeId;
      const employeeList = await EmployeeList.findOne({
        where: {
          moNumber: moNumber,
          workNumber: workNumber,
          employeeId: employeeId,
        },
      });
      if (!employeeList) {
        return res.status(404).json({ error: "Employee not found" });
      }
      if (!employeeList.endTime) {
        const end = new Date();
        const endHours = end.getHours().toString();
        const endMinutes = end.getMinutes().toString();
        const endSeconds = end.getSeconds().toString();
        const endTime = `${endHours}:${endMinutes}:${endSeconds}`;

        // 解析 startTime

        const [startHours, startMinutes, startSeconds] = employeeList.startTime.split(":");

        // 如果跨越了午休时间段，则增加午休时间
        const sleepTimeInfo = await SleepTime.findOne({
          where: {
            id: 1,
          },
        });
        let sleepTime = 0;

        if (startHours < 12 && endHours >= 12 + sleepTimeInfo.values) {
          sleepTime = sleepTimeInfo.values;
        }

        // 更新 endTime 和 sleepTime
        employeeList.endTime = endTime;
        employeeList.sleepTime = sleepTime;

        const startMilliseconds = parseInt(startHours) * 3600 + parseInt(startMinutes) * 60 + parseInt(startSeconds);
        const endMilliseconds = parseInt(endHours) * 3600 + parseInt(endMinutes) * 60 + parseInt(endSeconds);

        const diffSeconds = endMilliseconds - startMilliseconds;
        const totalTimeHours = (diffSeconds / 3600).toFixed(2);
        employeeList.totalTime = totalTimeHours;

        await employeeList.save();
      }

      return res.json({ success: true, response: "成員已完工", employeeListsInfo: await this.formattedEmployeeList(moNumber, workNumber) });
    } catch (error) {
      console.error("Error updating start time for all employees:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

module.exports = new EmployeeListController();
