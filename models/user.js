'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    Username: DataTypes.STRING
  }, {});
  User.associate = function(models) {
    User.belongsTo(models.Type);
  };
  return User;
};