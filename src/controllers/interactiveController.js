const sendDropDown = require('../utils/sendDropdown');
const ResponseModel = require('../models/Responses');
const {
  favouriteHobbiesDropDown, noResponseSeleced, moodString, thankYouResponse, unknownInteraction,
} = require('../constants/interactiveConstants');
const { helloQuestion } = require('../constants/messageConstants');

const moodSelectionResponse = async (payload) => {
  const selectedResponse = payload && payload.actions
  && payload.actions[0] && payload.actions[0].selected_option;
  if (!selectedResponse) {
    throw new Error(noResponseSeleced);
  }
  const user = payload && payload.user;
  const saveResponse = new ResponseModel({
    name: user.name, userId: user.id, question: helloQuestion, answers: selectedResponse,
  });
  await saveResponse.save();
  return favouriteHobbiesDropDown;
};

const hobbySelectionResponse = async (payload) => {
  const selectedResponse = payload && payload.actions
  && payload.actions[0] && payload.actions[0].selected_options;
  if (!selectedResponse) {
    throw new Error(noResponseSeleced);
  }
  const user = payload && payload.user;
  const saveResponse = new ResponseModel({
    name: user.name, userId: user.id, question: moodString, answers: selectedResponse,
  });
  await saveResponse.save();
  return thankYouResponse;
};

const interactiveMap = {
  mood_selection: moodSelectionResponse,
  hobby_selection: hobbySelectionResponse,
};
const processInteraction = async (req, res) => {
  const { body } = req;
  let { payload } = body;
  try {
    payload = JSON.parse(payload);
    const functionType = payload && payload.actions
    && payload.actions[0] && payload.actions[0].action_id;
    if (!interactiveMap[functionType]) {
      return res.status(400).json({ ok: false, message: unknownInteraction });
    }
    const result = await (interactiveMap[functionType](payload));
    res.status(200).json();
    return await sendDropDown(payload, result);
  } catch (error) {
    return res.status(400).json({ ok: false, message: error && error.message });
  }
};
module.exports = { processInteraction };
