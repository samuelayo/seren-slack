module.exports = {
  favouriteHobbiesDropDown: {
    blocks: [
      {
        type: 'section',
        block_id: 'section678',
        text: {
          type: 'mrkdwn',
          text: 'What is your favorite hobby',
        },
        accessory: {
          action_id: 'hobby_selection',
          type: 'multi_static_select',
          placeholder: {
            type: 'plain_text',
            text: 'Select multi hobbies',
          },
          options: [
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

          ],
        },
      },
    ],
  },
  noResponseSeleced: 'No response was selected',
  moodstring: 'What is your favorite hobby?',
  thankYouResponse: {
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
  },
  unknownInteraction: 'unknown interaction',
};
