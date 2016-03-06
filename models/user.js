'use strict';
module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    email: {
		type: DataTypes.STRING,
		allowNull: false,
		unique: true,
		validate: {
			isEmail: true,
		}
	},
    password: {
		type: DataTypes.STRING,
		allowNull: false
	},
    firstName: {
		type: DataTypes.STRING,
		allowNull: false
	},
    lastName: {  
		type: DataTypes.STRING,
		allowNull: false
	},
    bio: { 
		type: DataTypes.STRING,
		allowNull: true
	}
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return User;
};
