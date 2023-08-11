'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
        id:{
            type:Sequelize.INTEGER,
            autoIncrement:true,
            allowNull:false,
            primaryKey:true
        },
        name: { type: Sequelize.STRING, allowNull:false },
        username: { type: Sequelize.STRING, allowNull:false },
        password: { type: Sequelize.STRING, allowNull:false },
        is_deleted: { type: Sequelize.INTEGER, defaultValue: '0'},
        file: { type: Sequelize.STRING, allowNull:true},
        created_by: { type: Sequelize.INTEGER, defaultValue: '0'},
        updated_by: { type: Sequelize.INTEGER, defaultValue: '0'},
        createdAt: { allowNull: false, type: Sequelize.DATE},
        updatedAt: { allowNull: false, type: Sequelize.DATE}
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }
};