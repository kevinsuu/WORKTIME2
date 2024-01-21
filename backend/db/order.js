const { DataTypes } = require("sequelize");
const { sequelize } = require("../models/dbModel");

const Order = sequelize.define(
  "order",
  {
    moNumber: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    location: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    productionLineCode: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    productionLineName: {
      type: DataTypes.TEXT,
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
  },
  {
    tableName: "orders",
    timestamps: false,
  }
);

const afterSyncHandler = async () => {
  try {
    const ordersData = [
      {
        moNumber: "20240120001test",
        location: "生產一廠",
        productionLineCode: "PRODUCT_LINE_001",
        productionLineName: "產品一線",
        productNumber: "PRODUCT001",
        productName: "黑塑鏡盤(LH)",
        productSpecification: "(ABS)",
        expectedProductionQuantity: 100,
      },
      {
        moNumber: "20240120002test",
        location: "生產一廠",
        productionLineCode: "PRODUCT_LINE_001",
        productionLineName: "產品一線",
        productNumber: "PRODUCT002",
        productName: "白塑鏡盤(RH)",
        productSpecification: "(ABS)",
        expectedProductionQuantity: 150,
      },
      {
        moNumber: "20240120003test",
        location: "生產三廠",
        productionLineCode: "PRODUCT_LINE_003",
        productionLineName: "產品三線",
        productNumber: "PRODUCT003",
        productName: "紅塑鏡盤(LH)",
        productSpecification: "(ABS)",
        expectedProductionQuantity: 150,
      },
      {
        moNumber: "20240120004test",
        location: "生產四廠",
        productionLineCode: "PRODUCT_LINE_004",
        productionLineName: "產品四線",
        productNumber: "PRODUCT004",
        productName: "藍塑鏡盤(RH)",
        productSpecification: "(PC)",
        expectedProductionQuantity: 200,
      },
      {
        moNumber: "20240120005test",
        location: "生產五廠",
        productionLineCode: "PRODUCT_LINE_005",
        productionLineName: "產品五線",
        productNumber: "PRODUCT005",
        productName: "綠塑鏡盤(LH)",
        productSpecification: "(PP)",
        expectedProductionQuantity: 100,
      },
      {
        moNumber: "20240120006test",
        location: "生產六廠",
        productionLineCode: "PRODUCT_LINE_006",
        productionLineName: "產品六線",
        productNumber: "PRODUCT006",
        productName: "黃塑鏡盤(RH)",
        productSpecification: "(PET)",
        expectedProductionQuantity: 120,
      },
    ];

    for (const orderData of ordersData) {
      const existingOrder = await Order.findOne({
        where: {
          moNumber: orderData.moNumber,
        },
      });
      if (!existingOrder) {
        await Order.create(orderData);
      }
    }
  } catch (error) {
    console.error("Error while creating Order:", error);
  }
};

Order.afterSync(afterSyncHandler);
module.exports = Order;
