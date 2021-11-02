const sendDropDown = require('../utils/sendDropdown');

const generateHelloDropDown = (text, followUp) => {
  const options = [
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
  const response = {
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text,
        },
        accessory: {
          type: 'static_select',
          placeholder: {
            type: 'plain_text',
            text: followUp,
            emoji: true,
          },
          options,
          action_id: callbackId,
        },
      },
    ],
  };
  return response;
};

const processMessage = (req, res) => {
  const slackRequest = req.body;
  const { challenge } = slackRequest;
  if (challenge) return res.json(challenge).end();
  if (slackRequest.text === 'hello') {
    const text = `@${slackRequest.user_name} how are you doing?`;
    const followUp = 'Please select a response';
    res.status(200).json();
    const dropdown = generateHelloDropDown(text, followUp);
    return sendDropDown(slackRequest, dropdown);
  }

  return res.status(200).json({ ok: true });
};

module.exports = {
  processMessage,
};
