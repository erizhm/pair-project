'use strict';
const {
  Model
} = require('sequelize');
const bcrypt = require('bcryptjs')

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: "Email sudah terdaftar, gunakan email lain."
      },
      validate: {
        notEmpty: {
          msg: "Email tidak boleh kosong."
        },
        notNull: {
          msg: "Email tidak boleh kosong."
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Password tidak boleh kosong"
        },
        notNull: {
          msg: "Password tidak boleh kosong"
        },
        len: {
          args: [6],
          msg: "Password minimal 6 karakter"
        }
      }
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: 'User'
    }
  }, {
    sequelize,
    modelName: 'User',
    hooks: {
      beforeCreate(instance, options) {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(instance.password, salt);
        instance.password = hash;
      }
    }
  });

  return User;
};