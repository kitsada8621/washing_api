const bcrypt = require('bcrypt');

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

    let defaultAccounts = [
      {
        name: 'admin1',
        username: 'admin1',
        password: 'Pa$$word@123',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'admin2',
        username: 'admin2',
        password: 'Pa$$word@123',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ];

    var accounts = [];
    for (let i = 0; i < defaultAccounts.length; i++) {
      let account = defaultAccounts[i];

      // check account already exist
      let user = await queryInterface.sequelize.query('SELECT * FROM users WHERE username = ?', {
        replacements: [account.username],
        type: queryInterface.sequelize.QueryTypes.SELECT,
      }).then(user => user.length > 0 ? user[0] : null);

      if (!user) {
        // Hash password
        let salt = bcrypt.genSaltSync(10);
        let hashPassword = bcrypt.hashSync(account.password, salt);

        accounts.push({ ...account, password: hashPassword });
      }

    }

    // Create account
    if (accounts.length > 0) {
      let created = await queryInterface.bulkInsert('users', accounts, {});
      console.log('created: ', created);

    }

  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
