'use strict';
module.exports = (sequelize, DataTypes) => {
  const Types = sequelize.define('Types', {
    name: DataTypes.STRING
  }, {});
  Types.associate = function(models) {
    Types.hasMany(models.Users);
  };
  return Types;
};