'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('orders', {
      id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
        type: Sequelize.UUID
      },
      washerId: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      amount: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0
      },
      expiresIn: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null,
      },
      status: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      hasNotify: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('orders');
  }
};