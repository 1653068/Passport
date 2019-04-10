'use strict';
module.exports = (sequelize, DataTypes) => {
  const Type = sequelize.define('Type', {
    TypeLogin: DataTypes.STRING
  }, {});
  Type.associate = function(models) {
    Type.hasMany(models.User);
  };
  return Type;
};