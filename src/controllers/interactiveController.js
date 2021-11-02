const sendDropDown = require('../utils/sendDropdown');
const ResponseModel = require('../models/Responses');

const generateFavouriteHobbiesDropDown = (text, followUp) => {
  const options = [
    {
      text: {
        type: 'plain_text',
        text: 'Football',
      },
      value: 'Football',
    },

    {
      text: {
        type: 'plain_text',
        text: 'Music',
      },
      value: 'Music',
    },
    {
      text: {
        type: 'plain_text',
        text: 'Sleep',
      },
      value: 'Sleep',
    },

    {
      text: {
        type: 'plain_text',
        text: 'Movies',
      },
      value: 'Movies',
    },
    {
      text: {
        type: 'plain_text',
        text: 'Basketball',
      },
      value: 'Basketball',
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

const moodSelectionResponse = async (payload) => {
  const selectedResponse = payload && payload.actions && payload.actions[0] && payload.actions[0].selected_option;
  if (!selectedResponse) {
    console.log(selectedResponse, payload);
    throw new Error('No response was selected');
  }
  const user = payload && payload.user;
  const question = 'how are you doing?';
  const saveResponse = new ResponseModel({
    name: user.name, userId: user.id, question, answer: selectedResponse,
  });
  await saveResponse.save();
  const response = generateFavouriteHobbiesDropDown('What is your favorite hobby', 'Select multi hobbies');
  return response;
};

const hobbySelectionResponse = async(payload) => {
  const selectedResponse = payload && payload.actions && payload.actions[0] && payload.actions[0].selected_options;
  if (!selectedResponse) {
    console.log(selectedResponse, payload);
    throw new Error('No response was selected');
  }
  const user = payload && payload.user;
  const question = 'What is your favorite hobby?';
  const saveResponse = new ResponseModel({
    name: user.name, userId: user.id, question, answer: selectedResponse,
  });
  await saveResponse.save();
  const response = {
    blocks: [
      {
        type: 'section',
        text: {
          type: 'plain_text',
          text: 'Thank you.',
          emoji: true,
        },
      },
    ],
  };
  return response;
};

const interactiveMap = {
  mood_selection: moodSelectionResponse,
  hobby_selection: hobbySelectionResponse,
};
const processInteraction = async (req, res) => {
  const { body } = req;
  let { payload } = body;
  try {
    console.log('starting intraction');
    payload = JSON.parse(payload);
    console.log(payload);
    const functionType = payload && payload.actions && payload.actions[0] && payload.actions[0].action_id;
    if (!interactiveMap[functionType]) {
      console.log('oops, no func');
      return res.status(400).json({ ok: false, message: 'unknown interaction' });
    }
    const result = await (interactiveMap[functionType](payload));
    console.log('finishing intraction', result);
    res.status(200).json();
    return await sendDropDown(payload, result);
  } catch (error) {
    console.log('erroring intraction', error);
    return res.status(400).json({ ok: false, message: error && error.message });
  }
};
module.exports = { processInteraction };
