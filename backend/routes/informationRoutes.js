// informationRoutes.js
const express = require("express");
const EmployeeController = require("../controllers/employeeController");
const PasswordController = require("../controllers/passwordController");
const OrderController = require("../controllers/orderController");
const SleepTimeController = require("../controllers/sleepTimeController");
const ListController = require("../controllers/listController");
const employeeListController = require("../controllers/employeeListController");
const employeeInfoMaintainController = require("../controllers/employeeInfoMaintainController");
const StartWorkController = require("../controllers/startWorkController");
const ProductLineController = require("../controllers/productLineController");
const useAsync = (middleware) => {
  return (req, res, next) => {
    Promise.resolve(middleware(req, res, next)).catch(next);
  };
};
const router = express.Router();
// Employee routes
router.get("/employees", useAsync(EmployeeController.getEmployee));
router.get("/employees/:id", useAsync(EmployeeController.getEmployeeInfo));
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
router.get("/lists/:id", useAsync(ListController.getListInfo));
router.delete("/lists/:id", useAsync(ListController.deleteList));
router.post("/lists/:id", useAsync(ListController.updateListInfo));
router.get("/searchLists/:id/:select", useAsync(ListController.searchListInfo));

router.post("/exportLists/", useAsync(ListController.exportExcel));

// EmployeeList routes
router.get("/employeeLists/:moNumber/:workNumber", useAsync(employeeListController.getEmployeeList));
router.post("/employeeLists/:employeeId/:moNumber/:workNumber", useAsync(employeeListController.addEmployeeList));
router.post("/employeeLists/:moNumber/:workNumber", useAsync(employeeListController.allEmployeeStartWork));
router.post("/employeeListSingle/:employeeId/:moNumber/:workNumber", useAsync(employeeListController.singleEmployeeStartWork));
router.delete("/employeeListSingle/:employeeId/:moNumber/:workNumber", useAsync(employeeListController.singleDeleteEmployee));
router.put("/employeeListSingle/:employeeId/:moNumber/:workNumber", useAsync(employeeListController.singleCompleteEmployee));

// StartWork routes
router.post("/startWork", useAsync(StartWorkController.insertOrder));

// ProductLine routes
router.get("/productLine", useAsync(ProductLineController.getProductLine));

// CompleteLists routes
router.get("/completeLists", useAsync(ListController.getCompleteList));
router.delete("/completeLists/:id", useAsync(ListController.deleteCompleteList));

// EditEmployee routes`
router.put("/employeeInfoMaintain/:employeeId/:moNumber/:workNumber", useAsync(employeeInfoMaintainController.singleEditEmployee));
router.post("/employeeInfoMaintain/:employeeId/:moNumber/:workNumber", useAsync(employeeInfoMaintainController.addEmployeeList));

module.exports = router;
