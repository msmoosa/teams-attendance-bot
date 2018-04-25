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
        } else if (action === 'showAttendeeNames') {
            this.showAttendeeNames(message);
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
    showAttendeeNames: async function (message) {
        let attendanceDayId = message.value.attendance_day_id;
        let attendees = await storageManager.getAttendees(attendanceDayId);
        let session = await this.loadSessionAsync(message);

        session.send(this.getAttendeesCardMessage(session, attendees))
    },
    sendCardUpdate: async function (invokeMessage, activityId, attendanceLog) {
        // retrieve current total
        var totalAttendees = await storageManager.getTotalAttendeesCount(attendanceLog.attendance_day_id);

        // recreate message
        let session = await this.loadSessionAsync(invokeMessage);
        var updatedMessage = this.getAttendanceCardMessage(session, new Date(invokeMessage.value.date), totalAttendees);
        updatedMessage.attachments = []
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
    isAdaptiveCardEnabled: function () {
        return true;
    },
    getAttendanceCardMessage: function (session, date, attendanceCount) {
        const builder = require('botbuilder')
        const dateFormat = require('dateformat');
        const attendanceStatus = attendanceCount === 0 ?
            "No one has marked their attendance yet"
            : attendanceCount + " student" + (attendanceCount > 1 ? "s" : '') + " marked their attendance";
        const title = dateFormat(date, "ddd, mmm dS, yyyy") + ' Attendance';
        const subtitle = "Mark your attendance";
        const imageUrl = 'https://i.imgur.com/2FjmDkz.png';
        const value = {
            action: "markAttendance",
            extras: ["location"],
            date: dateFormat(date, 'isoDate'),
            lat: 28,
            lng: 77
        };

        let card;
        if (this.isAdaptiveCardEnabled()) {
            card = {
                'contentType': 'application/vnd.microsoft.card.adaptive',
                "content": {

                    "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
                    "type": "AdaptiveCard",
                    "version": "1.0",
                    "body": [
                        {
                            "type": "ColumnSet",
                            "columns": [
                                {
                                    "type": "Column",
                                    "width": 1,
                                    "items": [
                                        {
                                            "type": "Image",
                                            "url": imageUrl,
                                            "size": "auto"
                                        }
                                    ]
                                },
                                {
                                    "type": "Column",
                                    "width": 2,
                                    "items": [
                                        {
                                            "type": "TextBlock",
                                            "text": title,
                                            "weight": "bolder",
                                            "size": "extraLarge",
                                            "spacing": "none",
                                            "wrap": true
                                        },
                                        {
                                            "type": "TextBlock",
                                            "text": "Mark your attendance",
                                            "wrap": true,
                                            "isSubtle": true,
                                            "spacing": "none"
                                        },
                                        {
                                            "type": "TextBlock",
                                            "text": attendanceStatus,
                                            "size": "small",
                                            "wrap": true
                                        }
                                    ]
                                }
                            ]
                        }
                    ],
                    "actions": [
                        {
                            "type": "Action.Submit",
                            "title": "Mark Attendance",
                            "data": value
                        }
                    ]
                }
            }
        } else {
            card = new builder.ThumbnailCard(session)
                .title(title)
                .subtitle(subtitle)
                .text(attendanceStatus)
                .images([builder.CardImage.create(session, imageUrl)])
                .buttons([
                    {
                        title: "Mark Attendance",
                        type: 'invoke',
                        data: value
                    }
                ]);
        }

        return new builder.Message(session)
            .addAttachment(card)
    },
    getStatusCardMessage: function (session, attendanceDay) {
        const attendanceCount = attendanceDay.attendanceLogs.length;
        const title = dateFormat(attendanceDay.date, "ddd, mmm dS, yyyy") + ' Attendance';
        const mapManager = require('./mapManager')
        const imageUrl = mapManager.getMapUrl(attendanceDay.attendanceLogs);
        let attendanceStatus = attendanceCount + " students have marked their attendance";
        const value = {
            action: "showAttendeeNames",
            attendance_day_id: attendanceDay.id
        };

        let card;
        if (this.isAdaptiveCardEnabled()) {
            card = {
                'contentType': 'application/vnd.microsoft.card.adaptive',
                "content": {

                    "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
                    "type": "AdaptiveCard",
                    "version": "1.0",
                    "body": [
                        {
                            "type": "Container",
                            "items": [
                                {
                                    "type": "Image",
                                    "url": imageUrl,
                                    "size": "auto"
                                },
                                {
                                    "type": "TextBlock",
                                    "text": title,
                                    "weight": "bolder",
                                    "size": "Medium",
                                    "spacing": "none",
                                    "wrap": true
                                },
                                {
                                    "type": "TextBlock",
                                    "text": attendanceStatus,
                                    "size": "small",
                                    "wrap": true
                                }
                            ]
                        }
                    ],
                    "actions": [
                        {
                            "type": "Action.Submit",
                            "title": resources.showAttendeeNames,
                            "data": value
                        }
                    ]
                }
            };
        } else {
            card = new builder.HeroCard(session)
                .title(title)
                .text(attendanceStatus)
                .images([builder.CardImage.create(session, imageUrl)])
                .buttons([
                    {
                        title: resources.showAttendeeNames,
                        type: 'invoke',
                        value: JSON.stringify(value)
                    }
                ])
        }
        return new builder.Message(session)
            .addAttachment(card)
    },
    getAttendeesCardMessage: function (session, attendees) {
        const attendanceCount = attendees.length;
        const mapManager = require('./mapManager')
        const imageUrl = mapManager.getMapUrl(attendees);
        console.log(imageUrl);
        return new builder.Message(session)
            .addAttachment(new builder.HeroCard(session)
                .title('Attendees')
                .subtitle(attendanceCount + " students have marked their attendance")
                .text(this.getAttendeesHtml(attendees))
                .images([builder.CardImage.create(session, imageUrl)])
            )
    },
    getAttendeesHtml: function (attendees) {
        var html = '<ul>';
        html += attendees.reduce((html, attendee) =>
            html += '<li><b>' + attendee.user_name + '</b>' +
            ' (' + attendee.lat.toFixed(2) + ',' + attendee.lng.toFixed(2) + ')' +
            '</li>', '');
        html += '</ul>';
        return html;
    },
    onError: function (error) {
        console.error('Error in promise: ', error);
    }
}