module.exports = (sequelize, DataTypes) => {
    return sequelize.define('video', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      filename: DataTypes.STRING,
      originalUrl: DataTypes.STRING,
      processedUrl: DataTypes.STRING,
      status: {
        type: DataTypes.STRING,
        defaultValue: 'uploaded',
      },
      size: DataTypes.INTEGER,
duration: DataTypes.FLOAT,
    });
  };
  