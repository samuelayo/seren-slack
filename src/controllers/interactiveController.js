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
    console.log(selectedResponse, payload);
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
    console.log('starting intraction')
    payload = JSON.parse(payload);
    const functionType = payload && payload.callback_id;
    if (!interactiveMap[functionType]) {
        console.log('oops, no func')
      return res.status(400).json({ ok: false, message: 'unknown interaction' });
    }
    const result = interactiveMap[functionType](payload);
    console.log('finishing intraction', result)
    return res.status(200).json(result);
  } catch (error) {
    console.log('erroring intraction', error)
    return res.status(400).json({ ok: false, message: error && error.message });
  }
};
module.exports = { processInteraction };
