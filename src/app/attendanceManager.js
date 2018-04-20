module.exports = {
    bot: null,
    connector: null,
    getSupportedCommands: function () {
        return ['start attendance call'];
    },
    handleAttendanceCall: function (session, text) {
        var now = new Date();
        var msg = this.getAttendanceCardMessage(session, now, 0);
        session.send(msg).sendBatch((err, addresses) => {
            console.log(addresses[0]);
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
    markAttendance: function (message) {
        var userId = message.address.user.aadObjectId;
        var name = message.address.user.name;
        var lat = message.value.lat;
        var lng = message.value.lng;
        var date = message.value.date;

        // store information
        console.log('Marked attendance for ' + name + ' for ' + date);

        // update card
        this.sendCardUpdate(message);
    },
    sendCardUpdate: async function (invokeMessage) {
        // retrieve current total
        var totalAttendees = 1;

        // recreate message
        let session = await this.loadSessionAsync(invokeMessage);
        var updatedMessage = this.getAttendanceCardMessage(session, new Date(invokeMessage.value.date), totalAttendees);
        var address = invokeMessage.address;
        address.id = '1:1BkCQnzHd2cDAnfbRjGVleYm7be4b5wUh6FUZyzDaAV4';
        updatedMessage.address(address);
        // send update
        session.connector.update(updatedMessage.toMessage(), (err, data) => {
            console.log(err, data)
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
                            date: dateFormat(date, 'isoDate'),
                            lat: 28,
                            lng: 77
                        })
                    }
                ]))
    }
}