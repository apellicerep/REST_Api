const Sequelize = require('sequelize')

module.exports = (sequelize) => {
    class Course extends Sequelize.Model { }

    Course.init({
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        title: {
            type: Sequelize.STRING,
            validate: {
                notEmpty: {
                    msg: '"title" is required'
                }
            }
        },
        description: {
            type: Sequelize.TEXT,
            validate: {
                notEmpty: {
                    msg: '"title" is required'
                }
            }
        },
        estimatedTime: {
            type: Sequelize.STRING,
            allowNull: true,
            validate: {
                notEmpty: {
                    msg: '"title" is required'
                }
            }
        },
        materialsNeeded: {
            type: Sequelize.STRING,
            allowNull: true,
            validate: {
                notEmpty: {
                    msg: '"title" is required'
                }
            }
        }
    }, { sequelize });

    Course.associate = (models) => {
        Course.belongsTo(models.User, {
            foreignKey: {
                fieldName: 'userId',
                allowNull: false,
            },
        });
    };

    return Course;
}