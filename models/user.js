const Sequelize = require('sequelize')

module.exports = (sequelize) => {
    class User extends Sequelize.Model { }

    User.init({
        firstName: {
            type: Sequelize.STRING,
            validate: {
                notEmpty: {
                    msg: '"firstName" is required'
                }
            }
        },
        lastName: {
            type: Sequelize.STRING,
            validate: {
                notEmpty: {
                    msg: '"lastName" is required'
                }
            }

        },
        emailAddress: {
            type: Sequelize.STRING,
            validate: {
                notEmpty: {
                    msg: '"email" is required'
                },
                isEmail: {
                    msg: 'Must be a valid email "name@example.com"'
                }
            }
        },
        password: {
            type: Sequelize.STRING,
            validate: {
                notEmpty: {
                    msg: '"password" is required'
                }
            }
        }
    }
        , { sequelize });

    User.associate = (models) => {
        User.hasMany(models.Course, {
            foreignKey: {
                fieldName: 'userId',
                allowNull: false,
            },
        });
    };

    return User;
}