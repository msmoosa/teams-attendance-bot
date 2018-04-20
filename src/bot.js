'use strict';

module.exports.setup = function (app) {
    var builder = require('botbuilder');
    var teams = require('botbuilder-teams');
    var attendanceManager = require('./app/attendanceManager');
    var config = require('config');
    var botConfig = config.get('bot');

    // Create a connector to handle the conversations
    var connector = new teams.TeamsChatConnector({
        // It is a bad idea to store secrets in config files. We try to read the settings from
        // the environment variables first, and fallback to the config file.
        // See node config module on how to create config files correctly per NODE environment
        appId: process.env.MICROSOFT_APP_ID || botConfig.microsoftAppId,
        appPassword: process.env.MICROSOFT_APP_PASSWORD || botConfig.microsoftAppPassword
    });

    // Define a simple bot with the above connector that echoes what it received
    var bot = new builder.UniversalBot(connector, function (session) {
        // Message might contain @mentions which we would like to strip off in the response
        var text = teams.TeamsMessage.getTextWithoutMentions(session.message);
        if (text.includes('start attendance call')) {
            attendanceManager.handleAttendanceCall(session, text);
        } else {
            session.send('You said: %s', text);
        }
    });

    // Setup an endpoint on the router for the bot to listen.
    // NOTE: This endpoint cannot be changed and must be api/messages
    app.post('/api/messages', connector.listen());

    // Setup an invoke handler
    // TODO: cant figure out a way to access session
    connector.onInvoke((message, callback) => {
        console.log('=======invoke======\n', message);
        attendanceManager.onInvoke(connector, bot, message);
        callback(null, null, 200);
    })

    // Export the connector for any downstream integration - e.g. registering a messaging extension
    module.exports.connector = connector;
};
