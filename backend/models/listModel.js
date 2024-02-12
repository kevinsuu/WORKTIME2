// listModel.js
class ListModel {
  constructor(
    workNumber,
    moNumber,
    location,
    productionLineId,
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
    this.productionLineId = productionLineId;
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
