'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('washers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
        unique: true,
      },
      name: {
        type: Sequelize.STRING
      },
      serviceRate: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0
      },
      image: {
        type: Sequelize.STRING,
      },
      desc: {
        type: Sequelize.TEXT
      },
      status: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        allowNull: true
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
    await queryInterface.dropTable('washers');
  }
};