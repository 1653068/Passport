'use strict';
module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define('Users', {
    profileId: DataTypes.STRING,
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    email: DataTypes.STRING,
    token: DataTypes.STRING
  }, {});

  Users.prototype.validPassword = function (password) {
    return (password == this.password) ? 1 : 0;
  };
  Users.associate = function(models) {
    Users.belongsTo(models.Types);
  };
  return Users;
};