const generateFavouriteHobbiesDropDown = () => ({
  blocks: [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: 'What are your favorite hobbies?',
      },
      accessory: {
        type: 'multi_static_select',
        placeholder: {
          type: 'plain_text',
          text: 'Select an item',
          emoji: true,
        },
        options: [
          {
            text: {
              type: 'plain_text',
              text: 'Choice 1',
              emoji: true,
            },
            value: 'value-0',
          },
          {
            text: {
              type: 'plain_text',
              text: 'Choice 2',
              emoji: true,
            },
            value: 'value-1',
          },
        ],
        action_id: 'create_feedback_final_step',
      },
    },
  ],
});
const moodSelectionResponse = (payload) => {
  let selectedResponse = payload && payload.selected_options;
  selectedResponse = selectedResponse && selectedResponse[0];
  if (!selectedResponse) {
    throw new Error('No response was selected');
  }

  const response = generateFavouriteHobbiesDropDown();
  return response;
};
const interactiveMap = {
  mood_selection: moodSelectionResponse,
};
const processInteraction = (req, res) => {
  const { body } = req;
  let { payload } = body;
  try {
    payload = JSON.parse(payload);
    const functionType = payload && payload.callback_id;
    if (!interactiveMap[functionType]) {
      return res.status(400).json({ ok: false, message: 'unknown interaction' });
    }
    const result = interactiveMap[functionType](payload);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({ ok: false, message: error && error.message });
  }
};
module.exports = { processInteraction };
