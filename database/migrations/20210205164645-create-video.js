module.exports.up = async (queryInterface, DataTypes) => {
  await queryInterface.createTable('videos', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },

    name: {
      type: DataTypes.STRING,
      allowNull: true
    },

    path: {
      type: DataTypes.STRING,
      allowNull: true
    },

    size: {
      type: DataTypes.INTEGER,
      allowNull: true
    },

    price: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: true
    },

    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },

    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    },

    deletedAt: {
      allowNull: true,
      type: DataTypes.DATE
    }
  });
}

module.exports.down = async (queryInterface) => {
  await queryInterface.dropTable('videos');
}