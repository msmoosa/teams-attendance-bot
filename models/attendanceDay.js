const uuid = require('uuid')
module.exports = (sequelize, DataTypes) => {
    var AttendanceDay = sequelize.define('AttendanceDay', {
        id: { type: DataTypes.STRING, unique: true },
        date: { type: DataTypes.STRING, unique: 'daily_unique' },
        channel_id: { type: DataTypes.STRING, unique: 'daily_unique' },
        user_id: { type: DataTypes.STRING, unique: 'daily_unique' },
        user_aad_object_id: { type: DataTypes.STRING },
        channel_name: DataTypes.STRING,
        team_name: DataTypes.STRING,
        activity_id: DataTypes.STRING
    }, {
            tableName: 'attendance_day',
        });

    AttendanceDay.associate = function (models) {
        models.AttendanceDay.belongsTo(models.User, {
            onDelete: "CASCADE",
            foreignKey: {
                name: 'user_id',
                allowNull: false
            }
        });

        models.AttendanceDay.hasMany(models.AttendanceLog);
    };

    return AttendanceDay;
};