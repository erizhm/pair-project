'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Post.belongsTo(models.User, { foreignKey: 'UserId' })
      Post.belongsToMany(models.Hashtag, { through: 'PostHashtags', foreignKey: 'PostId' })
    }

    get formattedDate() {
        if (!this.createdAt) return 'Tanggal tidak tersedia'

        return this.createdAt.toLocaleDateString('id-ID', {
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
  }
  Post.init({
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: { msg: 'Konten tidak boleh kosong' },
        notEmpty: { msg: 'Konten harus diisi' }
      }
    },
    picture: DataTypes.STRING,
    UserId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Post',
  });
  return Post;
};