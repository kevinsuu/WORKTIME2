const SleepTime = require("../db/sleepTime");
const DataBase = require("../models/dbModel");

class SleepTimeController {
  constructor() {
    this.dataBase = DataBase;
  }

  async getSleepTime(req, res) {
    try {
      const sleepTimes = await SleepTime.findAll();
      return res.json(sleepTimes);
    } catch (error) {
      console.error("Error retrieving SleepTimes from database:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async setSleepTime(req, res) {
    const time = req.body.time;
    if (!time) {
      console.error("SleepTime is not set. Set a SleepTime before saving to the database.");
      return res.status(400).json({ error: "Bad Request" });
    }

    try {
      const [numOfAffectedRows, updatedSleepTimes] = await SleepTime.update(
        { values: time },
        {
          where: {
            id: 1,
          },
          returning: true, // 返回更新後的記錄，需要在 PostgreSQL 中使用 returning
        }
      );

      if (numOfAffectedRows > 0) {
        const updatedSleepTimeData = updatedSleepTimes.map((SleepTimeInstance) => SleepTimeInstance.get({ plain: true }));

        return res.json({ success: true, respone: updatedSleepTimeData });
      } else {
        console.log(`No SleepTime record found with id 1.`);
        return res.status(404).json({ error: "SleepTime not found" });
      }
    } catch (error) {
      console.error("Error saving SleepTime to database:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

module.exports = new SleepTimeController();
