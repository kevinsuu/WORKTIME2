const { DataTypes } = require("sequelize");
const { sequelize } = require("../models/dbModel");

const ProductLine = sequelize.define(
  "productLine",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    productionLineCode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    productionLineName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "productLine",
    timestamps: false,
  }
);

const afterSyncHandler = async () => {
  try {
    const productLineNames = ["產品一線", "產品二線", "產品三線", "產品四線", "產品五線", "產品六線"];
    for (const productName of productLineNames) {
      const existingProductLine = await ProductLine.findOne({
        where: {
          productionLineName: productName,
        },
      });
      if (!existingProductLine) {
        await ProductLine.create({
          productionLineName: productName,
          productionLineCode: `PRODUCT_LINE_${productLineNames.indexOf(productName) + 1}`,
        });
      }
    }
  } catch (error) {
    console.error("Error while creating ProductLine:", error);
  }
};

ProductLine.afterSync(afterSyncHandler);
module.exports = ProductLine;
