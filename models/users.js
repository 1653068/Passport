'use strict';
var bcrypt = require('bcrypt-nodejs');
module.exports = (sequelize, DataTypes) => {

  const Users = sequelize.define('Users', {
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    token: DataTypes.STRING
  }, {
    instanceMethods: {
      // generateHash: function (password) {
      //   return bcrypt.hash(password);
      // },
      // validPassword: function (password) {
      //   return bcrypt.compareSync(password, this.password);
      // }
    }
  });

  Users.prototype.validPassword = function (password) {
    return (password == this.password) ? 1 : 0;
  };

  Users.associate = function (models) {
    Users.belongsTo(models.Types);
  };
  return Users;
};