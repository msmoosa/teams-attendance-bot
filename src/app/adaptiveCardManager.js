const builder = require('botbuilder')
const teams = require('botbuilder-teams')
const faker = require('faker')
module.exports = {
    isSupportedCommand: function (command) {
        let commands = ['json', 'o365', 'list', 'listcard']
        return commands.reduce((prev, current) => {
            if (command.includes(current)) {
                prev = true;
            }

            return true;
        }, false);
    },
    handleCommand: function (session, text) {
        if (text.includes('json')) {
            let index = parseInt(text.substr(text.indexOf('json ') + 5));
            try {
                let card = {
                    'contentType': 'application/vnd.microsoft.card.adaptive',
                    "content": this.getAdaptiveCard(index)
                };
                session.send(new builder.Message(session).addAttachment(card));
            } catch (e) {
                console.log(e);
                session.send('Invalid JSON. Send in format <b>json {number}</b>')
            }
        } else if (text.includes('o365 ')) {
            let index = parseInt(text.substr(text.indexOf('o365 ') + 5));
            try {
                card =
                    new teams.O365ConnectorCard(session)
                        .summary("O365 connector card with sections")
                        .themeColor("#E67A9E")
                        .title("O365 connector card with sections and a long header")
                        .sections([
                            new teams.O365ConnectorCardSection(session)
                                .markdown(false)
                                .title(faker.lorem.sentence())
                                .text("Here's html text which is <b>bold</b> <i>Italic</i> There are headers like <h1>h1</h1> "
                                + "<h2>h2</h2> <h3>h3</h3> not <h4>h4</h4> <strike>strike</strike> <del>del is also strike</del>"
                                + "Here's a horizontal rule <hr>"
                                + "unordered list<ul><li>item 1</li><li>item 2</li></ul>"
                                + "ordered list <ol><li>item 1</li><li>item 2</li></ol>"
                                + "preformatted text in <pre>here's some with linebreaks\nnextline\nnextline    many spaces</pre> "
                                + "<blockquote>blockquote text</blockquote> "
                                + "<a href='https://microsoft.com'>microsoft.com link</a>"
                                + "<img src='http://www.publicdomainpictures.net/pictures/30000/t2/duck-on-a-rock.jpg' alt='Duck on a rock'></img>"
                                ),
                            // new teams.O365ConnectorCardSection(session)
                            //     .markdown(true)
                            //     .title(faker.lorem.sentence())
                            //     .text(faker.lorem.paragraphs()),
                            // new teams.O365ConnectorCardSection(session)
                            //     .markdown(true)
                            //     .title(faker.lorem.sentence())
                            //     .text(faker.lorem.paragraphs()),
                            // new teams.O365ConnectorCardSection(session)
                            //     .markdown(true)
                            //     .title(faker.lorem.sentence())
                            //     .text(faker.lorem.paragraphs())
                        ]);
                session.send(new builder.Message(session).addAttachment(card));
            } catch (e) {
                console.log(e);
                session.send('Oops.. there was an error ' + e)
            }
        } else if (text.includes('listcard')) {
            session.send(new builder.Message(session).addAttachment(
                {
                    "contentType": "application/vnd.microsoft.teams.card.list",
                    "content": {
                        "title": "Card title",
                        "items": [
                            {
                                "type": "file",
                                "id": "https://microsoft.sharepoint.com/teams/skypespacesteamnew/Shared%20Documents/Design/FinancialReport.xslx",
                                "title": "FinancialReport",
                                "subtitle": "teams > skypespacesteamnew > design",
                                "tap": {
                                    "type": "imback",
                                    "value": "editOnline https://microsoft.sharepoint.com/teams/skypespacesteamnew/Shared%20Documents/Design/FinancialReport.xlsx"
                                }
                            },
                            {
                                "type": "resultItem",
                                "icon": "https://cdn2.iconfinder.com/data/icons/social-icons-33/128/Trello-128.png",
                                "title": "Trello title",
                                "subtitle": "a trello subtitle",
                                "tap": {
                                    "type": "openurl",
                                    "value": "http://trello.com"
                                }
                            },
                            {
                                "type": "section",
                                "title": "Manager"
                            },
                            {
                                "type": "person",
                                "id": "gsheldon@microsoft.com",
                                "title": "Graham Sheldon",
                                "subtitle": "Principal PM Manager - Skypespaces PM",
                                "tap": {
                                    "type": "imback",
                                    "value": "whois gsheldon@microsoft.com"
                                }
                            }
                        ],
                        "buttons": [
                            {
                                "type": "imBack",
                                "title": "imback",
                                "value": "whois"
                            },

                            {
                                "type": "invoke",
                                "title": "invoke",
                                "value": "{test:\"value\"}"
                            },

                            {
                                "type": "messageBack",
                                "title": "messageBack",
                                "value": "{test:\"value\"}"
                            },

                            {
                                "type": "openUrl",
                                "title": "openUrl",
                                "value": "https://google.com"
                            }
                        ]
                    }
                }))
        } else if (text.includes('list')) {
            let reply = new builder.Message(session)
                .attachmentLayout(builder.AttachmentLayout.list)
                .attachments([
                    new builder.ThumbnailCard(session)
                        .title(faker.lorem.sentence())
                        .text(faker.lorem.paragraphs()),
                    new builder.ThumbnailCard(session)
                        .title(faker.lorem.sentence())
                        .text(faker.lorem.paragraphs()),
                    new builder.ThumbnailCard(session)
                        .title(faker.lorem.sentence())
                        .text(faker.lorem.paragraphs()),

                ]);
            session.send(reply);
        }
    },
    getO365Card: function (index) {
        let cards = [
            {
                "@type": "MessageCard",
                "@context": "http://schema.org/extensions",
                "themeColor": "0076D7",
                "summary": "Larry Bryant created a new task",
                "sections": [{
                    "activityTitle": "![TestImage](https://47a92947.ngrok.io/Content/Images/default.png)Larry Bryant created a new task",
                    "activitySubtitle": "On Project Tango",
                    "activityImage": "https://teamsnodesample.azurewebsites.net/static/img/image5.png",
                    "facts": [{
                        "name": "Assigned to",
                        "value": "Unassigned"
                    }, {
                        "name": "Due date",
                        "value": "Mon May 01 2017 17:07:18 GMT-0700 (Pacific Daylight Time)"
                    }, {
                        "name": "Status",
                        "value": "Not started"
                    }],
                    "markdown": true
                }],
                "potentialAction": [{
                    "@type": "ActionCard",
                    "name": "Add a comment",
                    "inputs": [{
                        "@type": "TextInput",
                        "id": "comment",
                        "isMultiline": false,
                        "title": "Add a comment here for this task"
                    }],
                    "actions": [{
                        "@type": "HttpPOST",
                        "name": "Add comment",
                        "target": "http://..."
                    }]
                }, {
                    "@type": "ActionCard",
                    "name": "Set due date",
                    "inputs": [{
                        "@type": "DateInput",
                        "id": "dueDate",
                        "title": "Enter a due date for this task"
                    }],
                    "actions": [{
                        "@type": "HttpPOST",
                        "name": "Save",
                        "target": "http://..."
                    }]
                }, {
                    "@type": "ActionCard",
                    "name": "Change status",
                    "inputs": [{
                        "@type": "MultichoiceInput",
                        "id": "list",
                        "title": "Select a status",
                        "isMultiSelect": "false",
                        "choices": [{
                            "display": "In Progress",
                            "value": "1"
                        }, {
                            "display": "Active",
                            "value": "2"
                        }, {
                            "display": "Closed",
                            "value": "3"
                        }]
                    }],
                    "actions": [{
                        "@type": "HttpPOST",
                        "name": "Save",
                        "target": "http://google.com"
                    }]
                }]
            }
        ];
        return cards[index];
    },
    getAdaptiveCard: function (index) {
        let cards = [
            {
                type: 'AdaptiveCard',
                "version": "1.0",
                speak: '<s>Your  meeting about "Adaptive Card design session"<break strength=\'weak\'/> is starting at 12:30pm</s><s>Do you want to snooze <break strength=\'weak\'/> or do you want to send a late notification to the attendees?</s>',
                body: [
                    {
                        'type': 'TextBlock',
                        'text': 'Adaptive Card design session',
                        'size': 'large',
                        'weight': 'bolder'
                    },
                    {
                        'type': 'TextBlock',
                        'text': 'Conf Room 112/3377 (10)'
                    },
                    {
                        'type': 'TextBlock',
                        'text': '12:30 PM - 1:30 PM'
                    },
                    {
                        'type': 'TextBlock',
                        'text': 'Snooze for'
                    },
                    {
                        'type': 'Input.ChoiceSet',
                        'id': 'snooze',
                        'style': 'compact',
                        'choices': [
                            {
                                'title': '5 minutes',
                                'value': '5'
                            },
                            {
                                'title': '15 minutes',
                                'value': '15'
                            },
                            {
                                'title': '30 minutes',
                                'value': '30'
                            }
                        ]
                    }
                ],
                'actions': [
                    {
                        'type': 'Action.OpenUrl',
                        'url': 'http://foo.com',
                        'title': 'Snooze'
                    },
                    {
                        'type': 'Action.OpenUrl',
                        'url': 'http://foo.com',
                        'title': 'I\'ll be late'
                    },
                    {
                        'type': 'Action.OpenUrl',
                        'url': 'http://foo.com',
                        'title': 'Dismiss'
                    }
                ]
            },
            {

                "type": "AdaptiveCard",
                "version": "1.0",
                "body": [
                    {
                        "type": "TextBlock",
                        "text": "At {{school}} you have the choice of three scenic scuba destinations. (choose one)",
                        "wrap": true
                    },
                    {
                        "type": "Container",
                        "selectAction": {
                            "title": "AlkiBeach",
                            "type": "Action.Submit",
                            "data": {
                                "destination": "Alki Beach"
                            }
                        },
                        "items": [
                            {
                                "type": "ColumnSet",
                                "columns": [
                                    {
                                        "type": "Column",
                                        "size": "1",
                                        "items": [
                                            {
                                                "type": "Image",
                                                "url": "http://adaptivecards.io/content/AlkiBeach.jpg"
                                            }
                                        ]
                                    },
                                    {
                                        "type": "Column",
                                        "size": "3",
                                        "items": [
                                            {
                                                "type": "TextBlock",
                                                "text": "Alki Beach",
                                                "size": "medium",
                                                "weight": "bolder"
                                            },
                                            {
                                                "type": "TextBlock",
                                                "text": "Venture off from the sandy beach and explore the nature that lies next to Seattle",
                                                "wrap": true,
                                                "separation": "none"
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "type": "Container",
                        "selectAction": {
                            "title": "AlkiBeach",
                            "type": "Action.Submit",
                            "data": {
                                "destination": "Alki Beach"
                            }
                        },
                        "items": [
                            {
                                "type": "ColumnSet",
                                "columns": [
                                    {
                                        "type": "Column",
                                        "size": "1",
                                        "items": [
                                            {
                                                "type": "Image",
                                                "url": "http://adaptivecards.io/content/AlkiBeach.jpg"
                                            }
                                        ]
                                    },
                                    {
                                        "type": "Column",
                                        "size": "3",
                                        "items": [
                                            {
                                                "type": "TextBlock",
                                                "text": "Alki Beach",
                                                "size": "medium",
                                                "weight": "bolder"
                                            },
                                            {
                                                "type": "TextBlock",
                                                "text": "Venture off from the sandy beach and explore the nature that lies next to Seattle",
                                                "wrap": true,
                                                "separation": "none"
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "type": "Container",
                        "selectAction": {
                            "title": "AlkiBeach",
                            "type": "Action.Submit",
                            "data": {
                                "destination": "Golden Gardens Park"
                            }
                        },
                        "items": [
                            {
                                "type": "ColumnSet",
                                "columns": [
                                    {
                                        "type": "Column",
                                        "size": "1",
                                        "items": [
                                            {
                                                "type": "Image",
                                                "url": "http://adaptivecards.io/content/GoldenGardensPark.jpg"
                                            }
                                        ]
                                    },
                                    {
                                        "type": "Column",
                                        "size": "3",
                                        "items": [
                                            {
                                                "type": "TextBlock",
                                                "text": "Golden Gardens Park",
                                                "size": "medium",
                                                "weight": "bolder"
                                            },
                                            {
                                                "type": "TextBlock",
                                                "text": "See the Olympic Mountains tower in the distance as you scuba dive in near one of our most scenic beaches",
                                                "separation": "none",
                                                "wrap": true
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "type": "Container",
                        "selectAction": {
                            "title": "AlkiBeach",
                            "type": "Action.Submit",
                            "data": {
                                "destination": "Bainbridge Island"
                            }
                        },
                        "items": [
                            {
                                "type": "ColumnSet",
                                "columns": [
                                    {
                                        "type": "Column",
                                        "size": "1",
                                        "items": [
                                            {
                                                "type": "Image",
                                                "url": "http://adaptivecards.io/content/BainbridgeIsland.jpg"
                                            }
                                        ]
                                    },
                                    {
                                        "type": "Column",
                                        "size": "3",
                                        "items": [
                                            {
                                                "type": "TextBlock",
                                                "text": "Bainbridge Island",
                                                "size": "medium",
                                                "weight": "bolder"
                                            },
                                            {
                                                "type": "TextBlock",
                                                "text": "Experience the island life and get away from the busy city with a scuba tour of Bainbridge island",
                                                "separation": "none",
                                                "wrap": true
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
                "version": "1.0",
                "type": "AdaptiveCard",
                "version": "1.0",
                "body": [
                    {
                        "type": "TextBlock",
                        "text": "At {{school}} you have the choice of three scenic scuba destinations. (choose one)",
                        "wrap": true
                    },
                    {
                        "type": "Container",
                        "selectAction": {
                            "type": "Action.Submit",
                            "data": {
                                "destination": "Alki Beach"
                            }
                        },
                        "items": [
                            {
                                "type": "ColumnSet",
                                "columns": [
                                    {
                                        "type": "Column",
                                        "size": "1",
                                        "items": [
                                            {
                                                "type": "Image",
                                                "url": "http://adaptivecards.io/content/AlkiBeach.jpg"
                                            }
                                        ]
                                    },
                                    {
                                        "type": "Column",
                                        "size": "3",
                                        "items": [
                                            {
                                                "type": "TextBlock",
                                                "text": "Alki Beach",
                                                "size": "medium",
                                                "weight": "bolder"
                                            },
                                            {
                                                "type": "TextBlock",
                                                "text": "Venture off from the sandy beach and explore the nature that lies next to Seattle",
                                                "wrap": true,
                                                "separation": "none"
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "type": "Container",

                        "items": [
                            {
                                "type": "ColumnSet",
                                "columns": [
                                    {
                                        "type": "Column",
                                        "size": "1",
                                        "items": [
                                            {
                                                "type": "Image",
                                                "url": "http://adaptivecards.io/content/GoldenGardensPark.jpg"
                                            }
                                        ]
                                    },
                                    {
                                        "type": "Column",
                                        "size": "3",
                                        "items": [
                                            {
                                                "type": "TextBlock",
                                                "text": "Golden Gardens Park",
                                                "size": "medium",
                                                "weight": "bolder"
                                            },
                                            {
                                                "type": "TextBlock",
                                                "text": "See the Olympic Mountains tower in the distance as you scuba dive in near one of our most scenic beaches",
                                                "separation": "none",
                                                "wrap": true
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "type": "Container",

                        "items": [
                            {
                                "type": "ColumnSet",
                                "columns": [
                                    {
                                        "type": "Column",
                                        "size": "1",
                                        "items": [
                                            {
                                                "type": "Image",
                                                "url": "http://adaptivecards.io/content/BainbridgeIsland.jpg"
                                            }
                                        ]
                                    },
                                    {
                                        "type": "Column",
                                        "size": "3",
                                        "items": [
                                            {
                                                "type": "TextBlock",
                                                "text": "Bainbridge Island",
                                                "size": "medium",
                                                "weight": "bolder"
                                            },
                                            {
                                                "type": "TextBlock",
                                                "text": "Experience the island life and get away from the busy city with a scuba tour of Bainbridge island",
                                                "separation": "none",
                                                "wrap": true
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
                "type": "AdaptiveCard",
                "version": "1.0",
                "speak": "<s>Flight KL0605 to San Fransisco has been delayed.</s><s>It will not leave until 10:10 AM.</s>",
                "body": [
                    {
                        "type": "ColumnSet",
                        "columns": [
                            {
                                "type": "Column",
                                "width": "auto",
                                "items": [
                                    {
                                        "type": "Image",
                                        "size": "small",
                                        "url": "http://messagecardplayground.azurewebsites.net/assets/Airplane.png"
                                    }
                                ]
                            },
                            {
                                "type": "Column",
                                "width": "stretch",
                                "items": [
                                    {
                                        "type": "TextBlock",
                                        "text": "Flight Status",
                                        "horizontalAlignment": "right",
                                        "isSubtle": true
                                    },
                                    {
                                        "type": "TextBlock",
                                        "text": "DELAYED",
                                        "horizontalAlignment": "right",
                                        "spacing": "none",
                                        "size": "large",
                                        "color": "attention"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "type": "ColumnSet",
                        "separator": true,
                        "spacing": "medium",
                        "columns": [
                            {
                                "type": "Column",
                                "width": "stretch",
                                "items": [
                                    {
                                        "type": "TextBlock",
                                        "text": "Passengers",
                                        "isSubtle": true,
                                        "weight": "bolder"
                                    },
                                    {
                                        "type": "TextBlock",
                                        "text": "Sarah Hum",
                                        "spacing": "small"
                                    },
                                    {
                                        "type": "TextBlock",
                                        "text": "Jeremy Goldberg",
                                        "spacing": "small"
                                    },
                                    {
                                        "type": "TextBlock",
                                        "text": "Evan Litvak",
                                        "spacing": "small"
                                    }
                                ]
                            },
                            {
                                "type": "Column",
                                "width": "auto",
                                "items": [
                                    {
                                        "type": "TextBlock",
                                        "text": "Seat",
                                        "horizontalAlignment": "right",
                                        "isSubtle": true,
                                        "weight": "bolder"
                                    },
                                    {
                                        "type": "TextBlock",
                                        "text": "14A",
                                        "horizontalAlignment": "right",
                                        "spacing": "small"
                                    },
                                    {
                                        "type": "TextBlock",
                                        "text": "14B",
                                        "horizontalAlignment": "right",
                                        "spacing": "small"
                                    },
                                    {
                                        "type": "TextBlock",
                                        "text": "14C",
                                        "horizontalAlignment": "right",
                                        "spacing": "small"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "type": "ColumnSet",
                        "spacing": "medium",
                        "separator": true,
                        "columns": [
                            {
                                "type": "Column",
                                "width": 1,
                                "items": [
                                    {
                                        "type": "TextBlock",
                                        "text": "Flight",
                                        "isSubtle": true,
                                        "weight": "bolder"
                                    },
                                    {
                                        "type": "TextBlock",
                                        "text": "KL0605",
                                        "spacing": "small"
                                    }
                                ]
                            },
                            {
                                "type": "Column",
                                "width": 1,
                                "items": [
                                    {
                                        "type": "TextBlock",
                                        "text": "Departs",
                                        "isSubtle": true,
                                        "horizontalAlignment": "center",
                                        "weight": "bolder"
                                    },
                                    {
                                        "type": "TextBlock",
                                        "text": "10:10 AM",
                                        "color": "attention",
                                        "weight": "bolder",
                                        "horizontalAlignment": "center",
                                        "spacing": "small"
                                    }
                                ]
                            },
                            {
                                "type": "Column",
                                "width": 1,
                                "items": [
                                    {
                                        "type": "TextBlock",
                                        "text": "Arrives",
                                        "isSubtle": true,
                                        "horizontalAlignment": "right",
                                        "weight": "bolder"
                                    },
                                    {
                                        "type": "TextBlock",
                                        "text": "12:00 AM",
                                        "color": "attention",
                                        "horizontalAlignment": "right",
                                        "weight": "bolder",
                                        "spacing": "small"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "type": "ColumnSet",
                        "spacing": "medium",
                        "separator": true,
                        "columns": [
                            {
                                "type": "Column",
                                "width": 1,
                                "items": [
                                    {
                                        "type": "TextBlock",
                                        "text": "Amsterdam",
                                        "isSubtle": true
                                    },
                                    {
                                        "type": "TextBlock",
                                        "text": "AMS",
                                        "size": "extraLarge",
                                        "color": "accent",
                                        "spacing": "none"
                                    }
                                ]
                            },
                            {
                                "type": "Column",
                                "width": "auto",
                                "items": [
                                    {
                                        "type": "TextBlock",
                                        "text": " "
                                    },
                                    {
                                        "type": "Image",
                                        "url": "http://messagecardplayground.azurewebsites.net/assets/airplane.png",
                                        "size": "small"
                                    }
                                ]
                            },
                            {
                                "type": "Column",
                                "width": 1,
                                "items": [
                                    {
                                        "type": "TextBlock",
                                        "text": "San Francisco",
                                        "isSubtle": true,
                                        "horizontalAlignment": "right"
                                    },
                                    {
                                        "type": "TextBlock",
                                        "text": "SFO",
                                        "horizontalAlignment": "right",
                                        "size": "extraLarge",
                                        "color": "accent",
                                        "spacing": "none"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
                "type": "AdaptiveCard",
                "version": "1.0",
                "body": [
                    {
                        "type": "Container",
                        "items": [
                            {
                                "type": "ColumnSet",
                                "columns": [
                                    {
                                        "type": "Column",
                                        "width": "auto",
                                        "items": [
                                            {
                                                "type": "Image",
                                                "url": "https://harybotb31a.blob.core.windows.net/imagestore/pull-request.png",
                                                "size": "small",
                                                "style": "default"
                                            }
                                        ]
                                    },
                                    {
                                        "type": "Column",
                                        "width": "stretch",
                                        "items": [
                                            {
                                                "type": "TextBlock",
                                                "text": "[Pull request 246396](https://adaptivecards.io): Make cards more awesome in Teams",
                                                "weight": "bolder",
                                                "wrap": true
                                            },
                                            {
                                                "type": "TextBlock",
                                                "text": "Robin Liao",
                                                "isSubtle": true,
                                                "spacing": "none",
                                                "wrap": true
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "type": "Container",
                        "items": [
                            {
                                "type": "TextBlock",
                                "text": "This check in adds support for Adaptive cards in teams."
                            },
                            {
                                "type": "FactSet",
                                "facts": [
                                    {
                                        "title": "Source branch",
                                        "value": "refs/heads/adaptiveCardv1"
                                    },
                                    {
                                        "title": "Target branch",
                                        "value": "refs/heads/develop"
                                    },
                                    {
                                        "title": "Team Project",
                                        "value": "Microsoft Teams"
                                    },
                                    {
                                        "title": "Repository",
                                        "value": "Teams"
                                    }
                                ]
                            }
                        ]
                    }
                ],
                "actions": [
                    {
                        "type": "Action.ShowCard",
                        "title": "Comment",
                        "card": {
                            "type": "AdaptiveCard",
                            "body": [
                                {
                                    "type": "Input.Text",
                                    "id": "comment",
                                    "placeholder": "Enter comment",
                                    "maxLength": 500
                                }
                            ],
                            "actions": [
                                {
                                    "type": "Action.Submit",
                                    "title": "Submit"
                                }
                            ]
                        }
                    },
                    {
                        "type": "Action.Submit",
                        "title": "View pull request",
                        "data": {
                            "x": 13
                        }
                    }
                ]
            },
            {
                "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
                "type": "AdaptiveCard",
                "version": "1.0",
                "body": [
                    {
                        "type": "Image",
                        "url": "https://harybotb31a.blob.core.windows.net/imagestore/music.png",
                        "size": "stretch"
                    },
                    {
                        "type": "TextBlock",
                        "text": "Year end party!",
                        "weight": "bolder",
                        "size": "medium"
                    },
                    {
                        "type": "TextBlock",
                        "text": "It's time to celebrate all the great work done over the past year in our annual event. Hope everyone can make it!",
                        "isSubtle": true,
                        "wrap": true
                    },
                    {
                        "type": "TextBlock",
                        "text": "Attending the event?",
                        "isSubtle": true,
                        "wrap": true
                    },
                    {
                        "type": "Input.ChoiceSet",
                        "id": "myColor2",
                        "style": "expanded",
                        "spacing": "small",
                        "isMultiSelect": false,
                        "value": "1",
                        "choices": [
                            {
                                "title": "Yes",
                                "value": "1"
                            },
                            {
                                "title": "No",
                                "value": "2"
                            }
                        ]
                    },
                    {
                        "type": "TextBlock",
                        "text": "Number of guests",
                        "isSubtle": true,
                        "wrap": true
                    },
                    {
                        "type": "Input.Number",
                        "spacing": "small",
                        "id": "number",
                        "placeholder": "Enter a number",
                        "min": 0,
                        "max": 3,
                        "value": 1
                    }
                ],
                "actions": [
                    {
                        "type": "Action.Submit",
                        "title": "Submit"
                    }
                ]
            },
            {
                "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
                "type": "AdaptiveCard",
                "version": "1.0",
                "body": [
                    {
                        "type": "ColumnSet",
                        "columns": [
                            {
                                "type": "Column",
                                "items": [
                                    {
                                        "type": "TextBlock",
                                        "text": "Schedule a meeting",
                                        "size": "default",
                                        "weight": "bolder"
                                    },
                                    {
                                        "type": "Input.Text",
                                        "id": "meetingTitle",
                                        "value": "Review feedback for contoso pitch"
                                    },
                                    {
                                        "type": "TextBlock",
                                        "isSubtle": true,
                                        "weight": "bolder",
                                        "wrap": true
                                    },
                                    {
                                        "type": "Container",
                                        "items": [
                                            {
                                                "type": "ColumnSet",
                                                "columns": [
                                                    {
                                                        "type": "Column",
                                                        "width": 1,
                                                        "items": [
                                                            {
                                                                "type": "TextBlock",
                                                                "text": "Available times:"
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        "type": "Column",
                                                        "width": 2,
                                                        "items": [
                                                            {
                                                                "type": "Input.ChoiceSet",
                                                                "id": "timeslot",
                                                                "style": "compact",
                                                                "isMultiSelect": false,
                                                                "value": "1",
                                                                "choices": [
                                                                    {
                                                                        "title": "Tomorrow 1:00 - 1:30 PM",
                                                                        "value": "1"
                                                                    },
                                                                    {
                                                                        "title": "Thursday 2:00PM - 2:30 PM",
                                                                        "value": "2"
                                                                    },
                                                                    {
                                                                        "title": "Friday 1:00 - 1:30 PM",
                                                                        "value": "3"
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ],
                "actions": [
                    {
                        "type": "Action.Submit",
                        "title": "Schedule meeting",
                        "data": {
                            "slot": "1"
                        }
                    },
                    {
                        "type": "Action.ShowCard",
                        "title": "Set custom time",
                        "card": {
                            "type": "AdaptiveCard",
                            "body": [
                                {
                                    "type": "Input.Date",
                                    "id": "customdate"
                                },
                                {
                                    "type": "Input.Time",
                                    "id": "customtime",
                                    "min": "09:00",
                                    "max": "17:00"
                                }
                            ],
                            "actions": [
                                {
                                    "type": "Action.Submit",
                                    "title": "Submit"
                                }
                            ]
                        }
                    }
                ]
            }
        ];

        if (index >= cards.length) {
            throw 'No card found for index ' + index;
        }
        return cards[index];
    }
}