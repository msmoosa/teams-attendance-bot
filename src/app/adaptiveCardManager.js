const builder = require('botbuilder')

module.exports = {
    isSupportedCommand: function (command) {
        return command.includes('json ');
    },
    handleCommand: function (session, text) {
        let index = parseInt(text.substr(text.indexOf('json ') + 5));
        try {
            let card = {
                'contentType': 'application/vnd.microsoft.card.adaptive',
                "content": this.getCard(index)
            };
            session.send(new builder.Message(session).addAttachment(card));
        } catch (e) {
            console.log(e);
            session.send('Invalid JSON. Send in format <b>json {number}</b>')
        }
    },
    getCard: function (index) {
        let cards = [
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