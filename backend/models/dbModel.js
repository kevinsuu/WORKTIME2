// dbModel.js
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("WORKTIME2", "postgres", "password", {
  host: "localhost",
  // host: "35.221.137.19",
  dialect: "postgres",
  logging: false, // 關閉 SQL logging
});
class DataBase {
  constructor() {
    if (!DataBase.instance) {
      this.sequelize = sequelize;
      DataBase.instance = this;
    }

    return DataBase.instance;
  }

  async query(queryText, values) {
    try {
      const result = await this.sequelize.query(queryText, {
        bind: values,
        type: this.sequelize.QueryTypes.SELECT,
      });
      return result;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new DataBase();
