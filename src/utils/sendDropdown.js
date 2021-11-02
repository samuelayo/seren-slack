const axios = require('axios');

const sendDropDown = (request, dropdown) => {
  axios.post(request.response_url, dropdown);
};

module.exports = sendDropDown;
