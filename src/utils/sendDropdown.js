const axios = require('axios');

const sendDropDown = async (request, dropdown) => {
  try {
    if (request && request.response_url) {
      await axios.post(request.response_url, dropdown);
    }
  } catch (error) {
    console.log('error', error);
  }
};

module.exports = sendDropDown;
