'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Products', [{
      name: 'Test Product1',
      product_number: '1000000',
      is_deleted: 1,
      file: '',
      created_by: 1,
      updated_by: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Test Product2',
      product_number: '1000001',
      is_deleted: 1,
      file: '',
      created_by: 1,
      updated_by: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    ]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    return queryInterface.bulkDelete('Products', null, {});
  }
};
