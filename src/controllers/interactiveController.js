const generateDropDown = require('../utils/generateDropdown');

const generateFavouriteHobbiesDropDown = (text, followUp) => {
  const actions = [
    {
      name: 'hobbies_list',
      text: 'Pick a response...',
      type: 'multi_static_select',
      placeholder: {
        type: 'plain_text',
        text: 'Select items',
      },
      options: [
        {
          text: {
            type: 'plain_text',
            text: '*this is plain_text text*',
          },
          value: 'value-0',
        },
        {
          text: {
            type: 'plain_text',
            text: '*this is plain_text text*',
          },
          value: 'value-1',
        },
        {
          text: {
            type: 'plain_text',
            text: '*this is plain_text text*',
          },
          value: 'value-2',
        },
      ],
    },
  ];

  const callbackId = 'hobby_selection';
  const fallbackText = 'If you could read this message, you\'d be choosing something you are feeling';
  return generateDropDown(text, followUp, callbackId, actions, fallbackText);
};

const moodSelectionResponse = (payload) => {
  let selectedResponse = payload && payload.actions;
  selectedResponse = selectedResponse && selectedResponse[0];
  selectedResponse = selectedResponse && selectedResponse.selected_options[0];
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
const processInteraction = (req, res) => {
  const { body } = req;
  let { payload } = body;
  try {
    console.log('starting intraction');
    payload = JSON.parse(payload);
    const functionType = payload && payload.callback_id;
    if (!interactiveMap[functionType]) {
      console.log('oops, no func');
      return res.status(400).json({ ok: false, message: 'unknown interaction' });
    }
    const result = interactiveMap[functionType](payload);
    console.log('finishing intraction', result);
    return res.status(200).json({
        "type": "input",
        "element": {
            "type": "multi_static_select",
            placeholder: {
                type: 'plain_text',
                text: 'Select items',
              },
              options: [
                {
                  text: {
                    type: 'plain_text',
                    text: '*this is plain_text text*',
                  },
                  value: 'value-0',
                },
                {
                  text: {
                    type: 'plain_text',
                    text: '*this is plain_text text*',
                  },
                  value: 'value-1',
                },
                {
                  text: {
                    type: 'plain_text',
                    text: '*this is plain_text text*',
                  },
                  value: 'value-2',
                },
              ],
        }
    });
  } catch (error) {
    console.log('erroring intraction', error);
    return res.status(400).json({ ok: false, message: error && error.message });
  }
};
module.exports = { processInteraction };
