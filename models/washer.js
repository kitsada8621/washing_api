'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Washer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Order, {
        foreignKey: 'washerId',
        as: 'orders',
        defaultValue: []
      })
    }
  }
  Washer.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      unique: true
    },
    name: DataTypes.STRING,
    serviceRate: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0
    },
    image: DataTypes.STRING,
    desc: DataTypes.TEXT,
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    sequelize,
    modelName: 'Washer',
    tableName: 'washers',
    timestamps: true,
  });
  return Washer;
};