'use strict';
module.exports = (sequelize, DataTypes) => {
    var User = sequelize.define('User', {
        id: DataTypes.STRING,
        name: DataTypes.STRING,
        team_id: DataTypes.STRING
    });

    User.associate = function (models) {
        models.User.hasMany(models.AttendanceDay);
    };

    return User;
};