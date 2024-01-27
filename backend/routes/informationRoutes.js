// informationRoutes.js
const express = require("express");
const EmployeeController = require("../controllers/employeeController");
const PasswordController = require("../controllers/passwordController");
const OrderController = require("../controllers/orderController");
const SleepTimeController = require("../controllers/sleepTimeController");
const ListController = require("../controllers/listController");
const employeeListController = require("../controllers/employeeListController");
const StartWorkController = require("../controllers/startWorkController");

const useAsync = (middleware) => {
  return (req, res, next) => {
    Promise.resolve(middleware(req, res, next)).catch(next);
  };
};
const router = express.Router();
// Employee routes
router.get("/employees", useAsync(EmployeeController.getEmployee));
router.post("/employees", useAsync(EmployeeController.setEmployee));

// Password routes
router.get("/passwords", useAsync(PasswordController.getPassword));
router.post("/passwords", useAsync(PasswordController.setPassword));

// Orders routes
router.get("/orders", useAsync(OrderController.getOrder));

// SleepTime routes
router.get("/sleeps", useAsync(SleepTimeController.getSleepTime));
router.post("/sleeps", useAsync(SleepTimeController.setSleepTime));

// List routes
router.get("/lists", useAsync(ListController.getList));
// EmployeeList routes
router.get("/employeeLists/:moNumber/:workNumber", useAsync(employeeListController.getEmployeeList));
// StartWork routes
router.post("/startWork", useAsync(StartWorkController.insertOrder));
module.exports = router;
