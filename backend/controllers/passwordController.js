const Password = require("../db/password");
const DataBase = require("../models/dbModel");

class PasswordController {
  constructor() {
    this.dataBase = DataBase;
  }

  async getPassword(req, res) {
    try {
      const passwords = await Password.findAll();
      res.json(passwords);
    } catch (error) {
      console.error("Error retrieving passwords from database:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async setPassword(req, res) {
    const requestData = req.body;
    const updatedPasswordDataArray = [];
    try {
      for (const data of requestData) {
        const { values, execution } = data;
        const [numOfAffectedRows, updatedPasswords] = await Password.update(
          { values },
          {
            where: { execution },
            returning: true,
          }
        );

        if (numOfAffectedRows > 0) {
          const updatedPasswordData = updatedPasswords.map((passwordInstance) =>
            passwordInstance.get({ plain: true })
          );
          updatedPasswordDataArray.push(updatedPasswordData);
        }
      }

      // Move res.json outside the loop
      res.json({ success: true, respone: updatedPasswordDataArray });
    } catch (error) {
      console.error("Error saving password to database:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

module.exports = new PasswordController();
