'use strict';
const bcrypt = require('bcryptjs')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */

    const users = require('../data/users.json')

    const salt = bcrypt.genSaltSync(10);

    users.forEach(el => {
      delete el.id
      el.password = bcrypt.hashSync(el.password, salt);
      el.createdAt = el.updatedAt = new Date()
    })

    await queryInterface.bulkInsert('Users', users, {}) 
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Users', null, {})
  }
};
