'use strict';
module.exports = (sequelize, DataTypes) => {
    var AttendanceDay = sequelize.define('AttendanceDay', {
        id: DataTypes.STRING,
        date: DataTypes.STRING,
        channel_id: DataTypes.STRING,
        channel_name: DataTypes.STRING,
        team_name: DataTypes.STRING,
        activity_id: DataTypes.STRING
    });

    AttendanceDay.associate = function (models) {
        models.AttendanceDay.belongsTo(models.User, {
            onDelete: "CASCADE",
            foreignKey: {
                allowNull: false
            }
        });
    };

    AttendanceDay.associate = function (models) {
        models.AttendanceDay.hasMany(models.AttendanceLog);
    };

    return AttendanceDay;
};