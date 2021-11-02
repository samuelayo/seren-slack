const processMessage = (req, res) => {
    // message comes in
    console.log(req.body)
    res.status(200).json({ ok: true});
};

module.exports = {
    processMessage,
};
