const storageManager = require('./storageManager')
const dateFormat = require('dateformat')
const resources = require('./resources')
const builder = require('botbuilder')

module.exports = {
    bot: null,
    connector: null,
    isSupportedCommand: function (command) {
        return this.getSupportedCommands().reduce((isSupported, currentCmd) => command.includes(currentCmd) || isSupported, false)
    },
    getSupportedCommands: function () {
        return [
            'start attendance call',
            'show attendees'
        ];
    },
    handleCommand: function (session, text) {
        let supportedCommands = this.getSupportedCommands();
        if (text.includes(supportedCommands[0])) {
            return this.handleAttendanceCall(session, text);
        } else if (text.includes(supportedCommands[1])) {
            return this.showAttendees(session, text);
        }
    },
    showAttendees: async function (session, text) {
        // find for today in available channels
        let today = new Date();
        let date = dateFormat(today, 'isoDate');
        let dateForDisplay = dateFormat(today, 'd mmm');
        // TODO: shows the first attendee list by default
        let attendanceDays = await storageManager.findAttendanceDays(session.message.user.aadObjectId, date).catch(this.onError);
        if (!attendanceDays) {
            session.send(resources.noAttendanceCallsForTheDay, dateForDisplay);
            return;
        }

        let attendanceDay = attendanceDays;
        session.send(this.getStatusCardMessage(session, attendanceDay));
    },
    handleAttendanceCall: async function (session, text) {
        var now = new Date();
        var attendanceDay = await storageManager.storeAttendanceDay(dateFormat(now, 'isoDate'), session.message)
            .catch((err) => { /* ignore error */ });

        if (!attendanceDay) {
            session.send(resources.attendanceStartedAlready);
            return;
        }

        var msg = this.getAttendanceCardMessage(session, now, 0);
        session.send(msg).sendBatch((err, addresses) => {
            storageManager.updateAttendanceDay(attendanceDay.id, addresses[0].id)
        });
    },
    onInvoke: function (connector, bot, message) {
        var action = message.value.action;
        this.connector = connector;
        this.bot = bot;
        if (action === 'markAttendance') {
            this.markAttendance(message);
        } else {
            console.error('Unknown action ' + action);
        }
    },
    markAttendance: async function (message) {
        var attendanceInfo = {
            userId: message.address.user.aadObjectId,
            channelId: message.sourceEvent.channel.id,
            name: message.address.user.name,
            lat: message.value.lat,
            lng: message.value.lng,
            date: message.value.date
        }

        // store information
        var attendanceLog = await storageManager.storeAttendanceLog(attendanceInfo).catch((err) => console.log('attendancelog storage failed', err))
        var activityId = await storageManager.getActivityId(attendanceInfo.date, attendanceInfo.channelId, attendanceLog)
        // update card
        this.sendCardUpdate(message, activityId, attendanceLog);
    },
    sendCardUpdate: async function (invokeMessage, activityId, attendanceLog) {
        // retrieve current total
        var totalAttendees = await storageManager.getTotalAttendeesCount(attendanceLog.attendance_day_id);

        // recreate message
        let session = await this.loadSessionAsync(invokeMessage);
        var updatedMessage = this.getAttendanceCardMessage(session, new Date(invokeMessage.value.date), totalAttendees);
        var address = invokeMessage.address;
        address.id = activityId;
        updatedMessage.address(address);
        // send update
        session.connector.update(updatedMessage.toMessage(), (err, data) => {
            console.log('[UpdateCard] Updated at ' + new Date())
        });
    },
    loadSessionAsync: function (event) {
        var bot = this.bot;
        return new Promise(function (resolve, reject) {
            bot.loadSession(event.address, (err, session) => {
                if (err) {
                    console.error("Error loading session", err);
                    reject(err);
                } else {
                    resolve(session);
                }
            });
        });
    },
    getAttendanceCardMessage: function (session, date, attendanceCount) {
        const builder = require('botbuilder')
        const dateFormat = require('dateformat');
        const attendanceStatus = attendanceCount === 0 ?
            "No one has marked their attendance yet"
            : attendanceCount + " student" + (attendanceCount > 1 ? "s" : '') + " marked their attendance";
        return new builder.Message(session)
            .addAttachment(new builder.ThumbnailCard(session)
                .title(dateFormat(date, "ddd, mmm dS, yyyy") + ' Attendance')
                .subtitle("Mark your attendance")
                .text(attendanceStatus)
                .images([builder.CardImage.create(session, 'https://i.imgur.com/2FjmDkz.png')])
                .buttons([
                    {
                        title: "Mark Attendance",
                        type: 'invoke',
                        value: JSON.stringify({
                            action: "markAttendance",
                            extras: ["location"],
                            date: dateFormat(date, 'isoDate'),
                            lat: 28,
                            lng: 77
                        })
                    }
                ]))
    },
    getStatusCardMessage: function (session, attendanceDay) {
        const attendanceCount = attendanceDay.attendanceLogs.length;
        const mapManager = require('./mapManager')
        const imageUrl = mapManager.getMapUrl(attendanceDay.attendanceLogs);
        console.log(imageUrl);
        return new builder.Message(session)
            .addAttachment(new builder.HeroCard(session)
                .title(dateFormat(attendanceDay.date, "ddd, mmm dS, yyyy") + ' Attendance')
                .text(attendanceCount + " students have marked their attendance")
                //.text(attendanceStatus)
                .images([builder.CardImage.create(session, imageUrl)])
                .buttons([
                    {
                        title: "Show Attendee Names",
                        type: 'invoke',
                        value: JSON.stringify({
                            action: "showAttendeeNames",
                            attendance_day_id: attendanceDay.id
                        })
                    }
                ]))
    },
    onError: function (error) {
        console.error('Error in promise: ', error);
    }
}