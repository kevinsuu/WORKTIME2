const { DataTypes } = require("sequelize");
const { sequelize } = require("../models/dbModel");
const ProductLine = require("./productLine");

const List = sequelize.define(
  "List",
  {
    workNumber: {
      type: DataTypes.TEXT,
      allowNull: false,

      primaryKey: true,
    },
    moNumber: {
      type: DataTypes.TEXT,
      allowNull: false,
      primaryKey: true,
    },
    location: {
      type: DataTypes.TEXT,
      allowNull: false,
      primaryKey: true,
    },
    productionLineId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    productNumber: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    productName: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    productSpecification: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    expectedProductionQuantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    completedQuantity: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    remark: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    productionHours: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
  },
  {
    tableName: "lists",
    timestamps: false,
  }
);
const afterSyncHandler = async () => {
  try {
    const listsData = [
      {
        workNumber: "20240121001",
        moNumber: "20240120001test",
        location: "生產一廠",
        productionLineId: 1,
        productNumber: "PRODUCT001",
        productName: "黑塑鏡盤(LH)",
        productSpecification: "(ABS)",
        expectedProductionQuantity: 100,
        status: "日班",
      },
      {
        workNumber: "20240121003",
        moNumber: "20240120005test",
        location: "生產五廠",
        productionLineId: 5,
        productNumber: "PRODUCT005",
        productName: "綠塑鏡盤(LH)",
        productSpecification: "(PP)",
        expectedProductionQuantity: 100,
        status: "日班",
      },
      {
        workNumber: "20240121002",
        moNumber: "20240120006test",
        location: "生產六廠",
        productionLineId: 6,
        productNumber: "PRODUCT006",
        productName: "黃塑鏡盤(RH)",
        productSpecification: "(PET)",
        expectedProductionQuantity: 120,
        status: "日班",
      },
    ];

    for (const listData of listsData) {
      const existingOrder = await List.findOne({
        where: {
          moNumber: listData.moNumber,
          workNumber: listData.workNumber,
        },
      });
      if (!existingOrder) {
        await List.create(listData);
      }
    }
  } catch (error) {
    console.error("Error while creating Order:", error);
  }
};
List.belongsTo(ProductLine, { foreignKey: "productionLineId" });

List.afterSync(afterSyncHandler);

module.exports = List;
