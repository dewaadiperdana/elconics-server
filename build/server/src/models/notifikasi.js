'use strict';

module.exports = function (sequelize, DataTypes) {
  var Notifikasi = sequelize.define('Notifikasi', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID
    },
    id_pengguna: DataTypes.UUID,
    judul: DataTypes.STRING,
    deskripsi: DataTypes.TEXT,
    tanggal: DataTypes.DATE,
    dibaca: DataTypes.BOOLEAN
  }, {
    freezeTableName: true,
    tableName: 'notifikasi',
    underscored: true
  });

  Notifikasi.associate = function (models) {
    Notifikasi.belongsTo(models.Pengguna, {
      foreignKey: 'id_pengguna',
      onDelete: 'CASCADE'
    });
  };

  return Notifikasi;
};
//# sourceMappingURL=notifikasi.js.map