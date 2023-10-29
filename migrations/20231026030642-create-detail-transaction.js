"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("detail_transaction", {
      trasaction_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "transaction",
          key: "transaction_id",
        },
      },
      product_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "product",
          key: "product_id",
        },
      },
      price: {
        type: Sequelize.DOUBLE,
      },
      qty: {
        type: Sequelize.DOUBLE,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("detail_transaction");
  },
};
