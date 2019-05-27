"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn("Users", "verifyToken", {
        type: Sequelize.STRING,
        defaultValue: null
      }),
      queryInterface.addColumn("Users", "isVerified", {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      })
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn("Users", "verifyToken"),
      queryInterface.removeColumn("Users", "isVerified")
    ]);
  }
};
