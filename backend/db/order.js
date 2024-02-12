const { DataTypes } = require("sequelize");
const { sequelize } = require("../models/dbModel");
const ProductLine = require("./productLine");

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
        productionLineId: 1,
        productNumber: "PRODUCT001",
        productName: "黑塑鏡盤(LH)",
        productSpecification: "(ABS)",
        expectedProductionQuantity: 100,
      },
      {
        moNumber: "20240120002test",
        location: "生產一廠",
        productionLineId: 1,
        productNumber: "PRODUCT002",
        productName: "白塑鏡盤(RH)",
        productSpecification: "(ABS)",
        expectedProductionQuantity: 150,
      },
      {
        moNumber: "20240120003test",
        location: "生產三廠",
        productionLineId: 3,
        productNumber: "PRODUCT003",
        productName: "紅塑鏡盤(LH)",
        productSpecification: "(ABS)",
        expectedProductionQuantity: 150,
      },
      {
        moNumber: "20240120004test",
        location: "生產四廠",
        productionLineId: 4,
        productNumber: "PRODUCT004",
        productName: "藍塑鏡盤(RH)",
        productSpecification: "(PC)",
        expectedProductionQuantity: 200,
      },
      {
        moNumber: "20240120005test",
        location: "生產五廠",
        productionLineId: 5,
        productNumber: "PRODUCT005",
        productName: "綠塑鏡盤(LH)",
        productSpecification: "(PP)",
        expectedProductionQuantity: 100,
      },
      {
        moNumber: "20240120006test",
        location: "生產六廠",
        productionLineId: 6,
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
Order.belongsTo(ProductLine, { foreignKey: "productionLineId" });

Order.afterSync(afterSyncHandler);
module.exports = Order;
