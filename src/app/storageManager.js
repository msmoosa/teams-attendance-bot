const models = require('../../models')
const uuid = require('uuid/v1')
const sequelize = require('sequelize')
module.exports = {
    storeAttendanceDay: function (date, sessionMessage) {
        return new Promise((resolve, reject) => {
            models.AttendanceDay.create({
                id: uuid(),
                date: date,
                user_id: sessionMessage.user.id,
                user_aad_object_id: sessionMessage.user.aadObjectId,
                channel_id: sessionMessage.sourceEvent.teamsChannelId,
                channel_name: '',
                team_name: sessionMessage.sourceEvent.teamsChannelId,
                activity_id: ''
            }).then(resolve).catch(error => {
                console.error('DB error: ', error);
                reject(null);
            })
        });
    },
    updateAttendanceDay: function (id, activityId) {
        return new Promise((resolve, reject) => {
            models.AttendanceDay.update(
                { activity_id: activityId },
                { where: { id: id } }
            )
                .then(resolve)
                .catch(reject)
        })
    },
    storeAttendanceLog: function (attendanceInfo) {
        return new Promise((resolve, reject) => {
            // find attendance day id
            models.AttendanceDay.findOne({
                where: {
                    date: attendanceInfo.date,
                    channel_id: attendanceInfo.channelId
                }
            }).then((attendanceDay) => {
                models.AttendanceLog.create({
                    id: uuid(),
                    user_id: attendanceInfo.userId,
                    user_name: attendanceInfo.name,
                    lat: attendanceInfo.lat,
                    lng: attendanceInfo.lng,
                    attendance_day_id: attendanceDay.id
                }).then((attendanceLog) => {
                    resolve(attendanceLog.dataValues)
                }).catch(reject);
            }).catch(reject);
        })
    },
    getActivityId: (date, channelId) => {
        return new Promise((resolve, reject) => {
            models.AttendanceDay.findOne({
                where: {
                    date: date,
                    channel_id: channelId
                }
            }).then((attendanceDay) => {
                resolve(attendanceDay.activity_id)
            }).catch(reject);
        })
    },
    getTotalAttendeesCount: (attendanceDayId) => {
        return new Promise((resolve, reject) => {
            models.AttendanceLog.count({
                where: { attendance_day_id: attendanceDayId }
            }).then(count => {
                resolve(count)
            });
        })
    },
    reset: () => {
        return new Promise((resolve, reject) => {
            models.AttendanceDay.destroy({ truncate: true })
                .then(resolve)
                .catch(reject)
        })
    }
}