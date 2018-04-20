'use strict';
module.exports = (sequelize, DataTypes) => {
    var AttendanceLog = sequelize.define('AttendanceLog', {
        id: DataTypes.STRING,
        user_id: DataTypes.STRING,
        user_name: DataTypes.STRING,
        lat: DataTypes.DECIMAL,
        lng: DataTypes.DECIMAL,
        updated_time: DataTypes.BIGINT
    });

    AttendanceLog.associate = function (models) {
        models.AttendanceLog.belongsTo(models.AttendanceDay, {
            onDelete: "CASCADE",
            foreignKey: {
                allowNull: false
            }
        });
    };

    return AttendanceLog;
};