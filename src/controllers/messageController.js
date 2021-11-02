const axios = require('axios');
const generateDropDown = require('../utils/generateDropdown');

const generateHelloDropDown = (text, followUp) => {
  const actions = [
    {
      name: 'mood_list',
      text: 'Pick a response...',
      type: 'select',
      options: [
        {
          text: 'Doing Well',
          value: 'Doing Well',
        },
        {
          text: 'Neutral',
          value: 'Neutral',
        },
        {
          text: 'Feeling Lucky',
          value: 'Feeling Lucky',
        },
      ],
    },
  ];
  const callbackId = 'mood_selection';
  const fallbackText = 'If you could read this message, you\'d be choosing something you are feeling';
  return generateDropDown(text, followUp, callbackId, actions, fallbackText);
};

const sendDropDown = (request) => {
    axios.post(request.response_url, {
        "blocks": [
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": "Pick an item from the dropdown list"
                },
                "accessory": {
                    "type": "static_select",
                    "placeholder": {
                        "type": "plain_text",
                        "text": "Select an item",
                        "emoji": true
                    },
                    "options": [
                        {
                            "text": {
                                "type": "plain_text",
                                "text": "*this is plain_text text*",
                                "emoji": true
                            },
                            "value": "value-0"
                        },
                        {
                            "text": {
                                "type": "plain_text",
                                "text": "*this is plain_text text*",
                                "emoji": true
                            },
                            "value": "value-1"
                        },
                        {
                            "text": {
                                "type": "plain_text",
                                "text": "*this is plain_text text*",
                                "emoji": true
                            },
                            "value": "value-2"
                        }
                    ],
                    "action_id": "static_select-action"
                }
            }
        ]
    })
}

const processMessage = (req, res) => {
  const slackRequest = req.body;
  const { challenge } = slackRequest;
  if (challenge) return res.json(challenge).end();
  if (slackRequest.text === 'hello') {
    const text = `@${slackRequest.user_name} how are you doing?`;
    const followUp = 'Please select a response';
    //const dropdown = generateHelloDropDown(text, followUp);
    res.status(200);
    return sendDropDown(slackRequest);
  }

  return res.status(200).json({ ok: true });
};

module.exports = {
  processMessage,
};
