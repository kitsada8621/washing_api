'use strict';
const {
  Model
} = require('sequelize');
const { Sequelize } = require('.');
module.exports = (sequelize, DataTypes) => {
  class UserTokens extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  UserTokens.init({
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      autoIncrement: false,
      unique: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'cascade',
      onDelete: 'cascade',
    },
    token: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'UserTokens',
    tableName: 'user_tokens',
    timestamps: true
  });
  return UserTokens;
};