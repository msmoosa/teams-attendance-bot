'use strict';
module.exports = (sequelize, DataTypes) => {
    var AttendanceLog = sequelize.define('AttendanceLog', {
        id: DataTypes.STRING,
        user_id: DataTypes.STRING,
        user_name: DataTypes.STRING,
        lat: DataTypes.DECIMAL,
        lng: DataTypes.DECIMAL,
    }, {
            tableName: 'attendance_log'
        });

    AttendanceLog.associate = function (models) {
        models.AttendanceLog.belongsTo(models.AttendanceDay, {
            onDelete: "CASCADE",
            foreignKey: {
                name: 'attendance_day_id',
                allowNull: false
            }
        });
    };

    return AttendanceLog;
};