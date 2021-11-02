module.exports = {
  helloDropdown: {
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: 'how are you doing?',
        },
        accessory: {
          type: 'static_select',
          placeholder: {
            type: 'plain_text',
            text: 'Please select a response',
            emoji: true,
          },
          options: [
            {
              text: {
                type: 'plain_text',
                text: 'Doing Well',
                emoji: true,
              },
              value: 'Doing Well',
            },
            {
              text: {
                type: 'plain_text',
                text: 'Neutral',
                emoji: true,
              },
              value: 'Neutral',
            },

            {
              text: {
                type: 'plain_text',
                text: 'Feeling Lucky',
                emoji: true,
              },
              value: 'Feeling Lucky',
            },
          ],
          action_id: 'mood_selection',
        },
      },
    ],
  },
  helloString: 'hello',
  helloQuestion: 'how are you doing?',
};
