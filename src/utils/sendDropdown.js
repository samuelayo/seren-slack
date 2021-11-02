const axios = require('axios');

const sendDropDown = async (request, dropdown) => {
  try {
    await axios.post(request.response_url, dropdown);
  } catch (error) {
    console.log('error', error);
  }
};

module.exports = sendDropDown;
