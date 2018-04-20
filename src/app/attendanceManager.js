module.exports = {
    bot: null,
    connector: null,
    handleAttendanceCall: function (session, text) {
        var now = new Date();
        var msg = this.getAttendanceCardMessage(session, now, 0);
        session.send(msg);
    },
    onInvoke: function (connector, bot, message) {
        var action = message.value.action;
        if (action === 'markAttendance') {
            this.markAttendance(message);
        } else {
            console.error('Unknown action ' + action);
        }
    },
    markAttendance: function (message) {
        var userId = message.address.user.aadObjectId;
        var name = message.address.user.name;
        var lat = message.value.lat;
        var lng = message.value.lng;
        var date = message.value.date;
        // store information
        console.log('Marked attendance for ' + name + ' for ' + date);
        // retrieve current total
        var totalAttendees = 1;
        // update card
        this.sendCardUpdate();
    },
    sendCardUpdate: function () {
        console.log('TODO Updating card');
    },
    getAttendanceCardMessage: function (session, date, attendanceCount) {
        const builder = require('botbuilder')
        const dateFormat = require('dateformat');
        const attendanceStatus = attendanceCount === 0 ?
            "No one has marked their attendance yet"
            : attendanceCount + " student" + (attendanceCount > 1 ? "s" : '') + " have marked their attendance";
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
                            date: dateFormat(date, 'isoDate'),
                            lat: 28,
                            lng: 77
                        })
                    }
                ]))
    }
}