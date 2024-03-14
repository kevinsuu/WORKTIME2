const EmployeeList = require("../db/employeeList");
const DataBase = require("../models/dbModel");
const Employee = require("../db/employee");
const SleepTime = require("../db/sleepTime");

class EmployeeInfoMaintainController {
  constructor() {
    this.dataBase = DataBase;
    this.singleDeleteEmployee = this.singleDeleteEmployee.bind(this);
    this.singleEditEmployee = this.singleEditEmployee.bind(this);
    this.addEmployeeList = this.addEmployeeList.bind(this);
    this.now = new Date(); // 建立一個日期物件
    this.taipeiTime = new Date(this.now.toLocaleString("en-US", { timeZone: "Asia/Taipei" }));
  }
  async formattedEmployeeList(moNumber, workNumber) {
    const employeeList = await EmployeeList.findAll({
      where: {
        moNumber: moNumber,
        workNumber: workNumber,
      },
      order: [["employeeId", "ASC"]],
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
    if (!employeeId) {
      console.error("employeeId is not set. Set a employeeId before saving to the database.");
      return res.status(400).json({ error: "Bad Request" });
    }

    try {
      const [employeeList, created] = await EmployeeList.findOrCreate({
        where: { employeeId: employeeId.toString(), moNumber: moNumber, workNumber: workNumber },
      });

      if (!created) {
        return res.json({ success: false, response: "員工已存在", employeeListData: await this.formattedEmployeeList(moNumber, workNumber) });
      } else {
        return res.json({ success: true, response: "員工已新增", employeeListData: await this.formattedEmployeeList(moNumber, workNumber) });
      }
    } catch (error) {
      console.error("Error saving employeeList to database:", error);
      return res.json({ success: false, response: "找不到員工" });
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
  async singleEditEmployee(req, res) {
    try {
      const moNumber = req.params.moNumber;
      const workNumber = req.params.workNumber;
      const employeeId = req.params.employeeId;
      const startTime = req.body.startTime;
      const endTime = req.body.endTime;
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
      const endTimeFormat = endTime.split(":");

      const endHours = parseInt(endTimeFormat[0], 10);
      const endMinutes = parseInt(endTimeFormat[1], 10);
      let endSeconds = "00";
      if (endTimeFormat[2] != undefined) {
        endSeconds = parseInt(endTimeFormat[2], 10);
      }
      const startTimeFormat = startTime.split(":");

      const startHours = parseInt(startTimeFormat[0], 10);
      const startMinutes = parseInt(startTimeFormat[1], 10);
      let startSeconds = "00";
      if (endTimeFormat[2] != undefined) {
        startSeconds = parseInt(startTimeFormat[2], 10);
      }
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
      employeeList.employeeId = employeeId;
      employeeList.employeeId = employeeId;

      employeeList.endTime = endTime;
      employeeList.sleepTime = sleepTime;

      const startMilliseconds = parseInt(startHours) * 3600 + parseInt(startMinutes) * 60 + parseInt(startSeconds);
      const endMilliseconds = parseInt(endHours) * 3600 + parseInt(endMinutes) * 60 + parseInt(endSeconds);

      const diffSeconds = endMilliseconds - startMilliseconds;
      const totalTimeHours = (diffSeconds / 3600).toFixed(2);
      employeeList.totalTime = totalTimeHours;
      await employeeList.save();
      console.log(moNumber, workNumber);
      return res.json({ success: true, response: "成員已完工", employeeListsInfo: await this.formattedEmployeeList(moNumber, workNumber) });
    } catch (error) {
      console.error("Error updating start time for all employees:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

module.exports = new EmployeeInfoMaintainController();
