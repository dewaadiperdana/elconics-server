'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')
      .then(() => {
        return queryInterface.createTable('ruang_obrolan', {
          id: {
            allowNull: false,
            primaryKey: true,
            type: Sequelize.UUID,
            defaultValue: Sequelize.literal('uuid_generate_v4()')
          },
          id_tukang: {
            type: Sequelize.UUID,
            references: {
              model: 'pengguna',
              key: 'id',
              as: 'id_tukang'
            }
          },
          id_pelanggan: {
            type: Sequelize.UUID,
            references: {
              model: 'pengguna',
              key: 'id',
              as: 'id_pelanggan'
            }
          },
          kode_ruang: {
            type: Sequelize.STRING
          },
          status: {
            type: Sequelize.BOOLEAN
          },
          created_at: {
            allowNull: false,
            type: Sequelize.DATE,
            defaultValue: Sequelize.literal('NOW()')
          },
          updated_at: {
            allowNull: false,
            type: Sequelize.DATE,
            defaultValue: Sequelize.literal('NOW()')
          }
        });
      });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('ruang_obrolan');
  }
};