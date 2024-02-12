// dbModel.js
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("WORKTIME2", "postgres", "password", {
  host: "postgres",
  // host: "localhost",
  dialect: "postgres",
  logging: false, // 關閉 SQL logging
});
class DataBase {
  constructor() {
    this.sequelize = sequelize;
  }

  async query(queryText) {
    try {
      const result = await this.sequelize.query(queryText, {
        type: this.sequelize.QueryTypes.SELECT,
      });
      return result;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new DataBase();
