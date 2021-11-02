const ResponseModel = require('../models/Responses');

/**
 * @param {*} req -> express request object
 * @param {*} res -> express response object
 */
const allAnswers = async (req, res) => {
  try {
    let { limit, page } = req.body;
    if (!limit || limit > 50) limit = 50;
    if (!page) page = 1;
    const totalCount = await ResponseModel.countDocuments({});
    const results = await ResponseModel.find({})
      .limit(limit)
      .skip(limit * (page - 1))
      .select('-updatedAt')
      .select('-__v')
      .select('-_id')
      .exec();
    return res.status(200).json({
      ok: true, results, totalCount, paginationLimit: limit,
    });
  } catch (error) {
    return res.status(400).json({ ok: false, message: error && error.message });
  }
};

/**
 * @param {*} req -> express request object
 * @param {*} res -> express response object
 */
const specificUserAnswers = async (req, res) => {
  try {
    let { limit, page } = req.body;
    const { userId } = req.params;
    if (!limit || limit > 50) limit = 50;
    if (!page) page = 1;
    const totalCount = await ResponseModel.countDocuments({ userId });
    const results = await ResponseModel.find({ userId })
      .limit(limit)
      .skip(limit * (page - 1))
      .select('-updatedAt')
      .select('-__v')
      .select('-_id')
      .exec();
    return res.status(200).json({
      ok: true, results, totalCount, paginationLimit: limit,
    });
  } catch (error) {
    return res.status(400).json({ ok: false, message: error && error.message });
  }
};

module.exports = {
  allAnswers,
  specificUserAnswers,
};
