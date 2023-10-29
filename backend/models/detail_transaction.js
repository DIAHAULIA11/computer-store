"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class detail_transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.product, {
        foreignKey: "product_id",
        as: "product",
      });
    }
  }
  detail_transaction.init(
    {
      transaction_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },

      product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },

      price: DataTypes.DOUBLE,
      qty: DataTypes.DOUBLE,
    },

    {
      sequelize,
      modelName: "detail_transaction",
      tableName: "detail_transaction",
    }
  );

  return detail_transaction;
};
