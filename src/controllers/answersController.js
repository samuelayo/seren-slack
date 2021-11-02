const ResponseModel = require('../models/Responses');

const allAnswers = async (req, res) => {
  try {
    let { limit, page } = req.body;
    if (!limit || limit > 50) limit = 50;
    if (!page) page = 1;
    const totalCount = await ResponseModel.countDocuments({});
    const result = await ResponseModel.find({})
      .limit(limit)
      .skip(limit * (page - 1))
      .exec();
    return res.status(200).json({
      ok: true, result, totalCount, paginationLimit: limit,
    });
  } catch (error) {
    return res.status(400).json({ ok: false, message: error && error.message });
  }
};

const specificUserAnswers = async (req, res) => {
  try {
    let { limit, page } = req.body;
    const { userId } = req.params;
    if (!limit || limit > 50) limit = 50;
    if (!page) page = 1;
    const totalCount = await ResponseModel.countDocuments({ userId });
    const result = await ResponseModel.find({ userId })
      .limit(limit)
      .skip(limit * (page - 1))
      .exec();
    return res.status(200).json({
      ok: true, result, totalCount, paginationLimit: limit,
    });
  } catch (error) {
    return res.status(400).json({ ok: false, message: error && error.message });
  }
};

module.exports = {
  allAnswers,
  specificUserAnswers,
};
