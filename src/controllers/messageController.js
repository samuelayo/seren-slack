const sendDropDown = require('../utils/sendDropdown');

const generateHelloDropDown = (text, followUp) => {
  const options = [
    {
      text: {
        type: 'plain_text',
        text: 'Doing Well',
        emoji: true,
      },
      value: 'Doing Well',
    },
    {
      text: {
        type: 'plain_text',
        text: 'Neutral',
        emoji: true,
      },
      value: 'Neutral',
    },

    {
      text: {
        type: 'plain_text',
        text: 'Feeling Lucky',
        emoji: true,
      },
      value: 'Feeling Lucky',
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

const processMessage = async (req, res) => {
  const slackRequest = req.body;
  const { challenge } = slackRequest;
  if (challenge) return res.json(challenge).end();
  if (slackRequest.text === 'hello') {
    const text = `@${slackRequest.user_name} how are you doing?`;
    const followUp = 'Please select a response';
    res.status(200).json();
    const dropdown = generateHelloDropDown(text, followUp);
    // eslint-disable-next-line no-return-await
    return await sendDropDown(slackRequest, dropdown);
  }

  return res.status(200).json({ ok: true });
};

module.exports = {
  processMessage,
};
