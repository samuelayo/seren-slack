const sendDropDown = require('../utils/sendDropdown');

const generateFavouriteHobbiesDropDown = (text, followUp) => {
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

  const callbackId = 'hobby_selection';
  const response = {
    blocks: [
      {
        type: 'section',
        block_id: 'section678',
        text: {
          type: 'mrkdwn',
          text,
        },
        accessory: {
          action_id: callbackId,
          type: 'multi_static_select',
          placeholder: {
            type: 'plain_text',
            text: followUp,
          },
          options,
        },
      },
    ],
  };
  return response;
};

const moodSelectionResponse = (payload, selectedResponse) => {
  if (!selectedResponse) {
    console.log(selectedResponse, payload);
    throw new Error('No response was selected');
  }

  const response = generateFavouriteHobbiesDropDown('What is your favorite hobby', 'Select multi hobbies');
  return response;
};
const interactiveMap = {
  mood_selection: moodSelectionResponse,
};
const processInteraction = async (req, res) => {
  const { body } = req;
  let { payload } = body;
  try {
    console.log('starting intraction');
    payload = JSON.parse(payload);
    console.log(payload)
    const functionType = payload && payload.actions && payload.actions[0] && payload.actions[0].action_id;
    if (!interactiveMap[functionType]) {
      console.log('oops, no func');
      return res.status(400).json({ ok: false, message: 'unknown interaction' });
    }
    const selected = payload && payload.actions && payload.actions[0] && payload.actions[0].selected_option;
    const result = interactiveMap[functionType](payload, selected);
    console.log('finishing intraction', result);
    res.status(200).json();
    return await sendDropDown(payload, result);
  } catch (error) {
    console.log('erroring intraction', error);
    return res.status(400).json({ ok: false, message: error && error.message });
  }
};
module.exports = { processInteraction };
