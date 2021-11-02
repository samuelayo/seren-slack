const sendDropDown = require('../utils/sendDropdown');
const { helloDropdown, helloString } = require('../constants/messageConstants');

const processMessage = async (req, res) => {
  const slackRequest = req.body;
  const { challenge } = slackRequest;
  if (challenge) return res.json(challenge).end();
  if (slackRequest.text === helloString) {
    res.status(200).json();
    // eslint-disable-next-line no-return-await
    return await sendDropDown(slackRequest, helloDropdown);
  }
  return res.status(200).json({ ok: true });
};

module.exports = {
  processMessage,
};
