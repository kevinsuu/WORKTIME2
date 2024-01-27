// listModel.js
class ListModel {
  constructor(
    workNumber,
    moNumber,
    location,
    productionLineCode,
    productionLineName,
    productNumber,
    productName,
    productSpecification,
    expectedProductionQuantity,
    status,
    completedQuantity,
    remark,
    productionHours
  ) {
    this.workNumber = workNumber;
    this.moNumber = moNumber;
    this.location = location;
    this.productionLineCode = productionLineCode;
    this.productionLineName = productionLineName;
    this.productNumber = productNumber;
    this.productName = productName;
    this.productSpecification = productSpecification;
    this.expectedProductionQuantity = expectedProductionQuantity;
    this.status = status;
    this.completedQuantity = completedQuantity;
    this.remark = remark;
    this.productionHours = productionHours;
  }
}

module.exports = ListModel;
