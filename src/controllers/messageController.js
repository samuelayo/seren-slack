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

const processMessage = (req, res) => {
  const slackRequest = req.body;
  const { challenge } = slackRequest;
  if (challenge) return res.json(challenge).end();
  if (slackRequest.text === 'hello') {
    const text = `@${slackRequest.user_name} how are you doing?`;
    const followUp = 'Please select a response';
    const dropdown = generateHelloDropDown(text, followUp);
    return res.status(200).json(dropdown);
  }

  return res.status(200).json({ ok: true });
};

module.exports = {
  processMessage,
};
