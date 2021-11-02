const processMessage = (req, res) => {
    // message comes in
    const slackRequest = req.body;
    const challenge = slackRequest.challenge;
    console.log(slackRequest)
    if (challenge) return res.json(challenge).end();
    res.status(200).json({ ok: true });
};

module.exports = {
    processMessage,
};
