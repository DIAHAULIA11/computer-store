"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.customer, {
        foreignKey: "customer_id",
        as: "customer",
      });

      this.hasMany(models.detail_transaction, {
        foreignKey: "transaction_id",
        as: "detail_transaction",
      });
    }
  }
  transaction.init(
    {
      transaction_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      customer_id: DataTypes.INTEGER,
      waktu: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "transaction",
      tableName: "transaction",
    }
  );
  return transaction;
};
