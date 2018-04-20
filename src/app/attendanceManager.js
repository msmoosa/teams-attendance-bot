

module.exports = {
    handleAttendanceCall: function (session, text) {
        var builder = require('botbuilder');
        var dateFormat = require('dateformat');
        var now = new Date();
        var msg = new builder.Message(session)
            .addAttachment(new builder.ThumbnailCard(session)
                .title(dateFormat(now, "ddd, mmm dS, yyyy") + ' Attendance')
                .subtitle("Mark your attendance")
                .text("No one has marked their attendance yet")
                .images([builder.CardImage.create(session, 'https://i.imgur.com/2FjmDkz.png')])
                .buttons([
                    builder.CardAction.imBack(session, "I am present", "Mark Attendance")
                ]));
        session.send(msg);
    }
}