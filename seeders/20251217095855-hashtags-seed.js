'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    const hashtags = require('../data/hashtags.json')

    hashtags.forEach(el => {
      delete el.id
      el.createdAt = el.updatedAt = new Date()
    })

    await queryInterface.bulkInsert('Hashtags', hashtags, {})
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Hashtags', null, {})
  }
};
