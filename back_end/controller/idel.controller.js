const {
    getAllIdeaWithFilter,
    countAllIdeas,
  } = require("../service/idea.service");

const getAllIdeas = async (req, res) => {
    const { filter, page } = req.query;
    const id = req.user._id;
    const pages = await countAllIdeas();
    const allIdeas = await getAllIdeaWithFilter(id, filter, page);
    res.status(200).json({ pages, data: allIdeas });
  };

  module.exports = { getAllIdeas };