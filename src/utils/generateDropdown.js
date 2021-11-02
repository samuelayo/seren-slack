// eslint-disable-next-line camelcase
const generateDropDown = (text, followUp, callback_id, actions, fallback) => ({
  text,
  response_type: 'in_channel',
  attachments: [
    {
      text: followUp,
      fallback,
      color: '#3AA3E3',
      attachment_type: 'default',
      callback_id,
      actions,
    },
  ],
});

module.exports = generateDropDown;
