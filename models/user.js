'use strict';
module.exports = (sequelize, DataTypes) => {
    var User = sequelize.define('User', {
        id: { type: DataTypes.STRING, unique: true },
        name: DataTypes.STRING,
        team_id: DataTypes.STRING
    }, {
            tableName: 'user'
        });

    User.associate = function (models) {
        models.User.hasMany(models.AttendanceDay);
    };

    return User;
};