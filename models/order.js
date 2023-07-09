'use strict';
const {
  Model, Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Washer, {
        foreignKey: 'washerId',
        as: 'washer',
        defaultValue: null,
      });
    }
  }
  Order.init({
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      autoIncrement: false,
      unique: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4
    },
    washerId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'washers',
        key: 'id'
      },
      onUpdate: 'cascade',
      onDelete: 'cascade'
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },
    expiresIn: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null
    },
    status: {
      type: DataTypes.INTEGER, // 0: null, 1: success, 2: fail, 3 inprogress
      defaultValue: 0
    },
    hasNotify: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    }
  }, {
    sequelize,
    modelName: 'Order',
    tableName: 'orders',
    timestamps: true,
  });
  return Order;
};