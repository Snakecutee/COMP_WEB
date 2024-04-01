const getAllIdeaWithFilter = async (
    id,
    filter = filterEnum.ALPHABET,
    page = 1,
    limit = 5
  ) => {
    switch (filter) {
      case filterEnum.VIEW:
        return (allIdeaInDB = await IdeaModel.find({})
          .populate("category", "name")
          .populate("magazine", "name")
          .populate("academy", "name")
          .sort({ viewCount: -1 })
          .skip((page - 1) * limit)
          .limit(limit));
      case filterEnum.ALPHABET:
        return (allIdeaInDB = await IdeaModel.find({})
          .populate("category", "name")
          .populate("magazine", "name")
          .populate("academy", "name")
          .sort({ title: 1 })
          .skip((page - 1) * limit)
          .limit(limit));
      case filterEnum.LIKE:
        const allPostWithLike = await IdeaModel.find({})
          .populate("category", "name")
          .populate("magazine", "name")
          .populate("academy", "name");
        return (allIdeaInDB = allPostWithLike
          .sort(
            (prevIdea, nextIdea) =>
              nextIdea.reactions.filter((item) => item.reactionType === "Like")
                .length -
              prevIdea.reactions.filter((item) => item.reactionType === "Like")
                .length
          )
          .slice((page - 1) * limit, page * limit));
      case filterEnum.DISLIKE:
        const allPostWithDislike = await IdeaModel.find({})
          .populate("category", "name")
          .populate("magazine", "name")
          .populate("academy", "name");
        return (allIdeaInDB = allPostWithDislike
          .sort(
            (prevIdea, nextIdea) =>
              nextIdea.reactions.filter((item) => item.reactionType === "Dislike")
                .length -
              prevIdea.reactions.filter((item) => item.reactionType === "Dislike")
                .length
          )
          .slice((page - 1) * limit, page * limit));
      case filterEnum.POPULAR:
        const allPostWithBoth = await IdeaModel.find({})
          .populate("category", "name")
          .populate("magazine", "name")
          .populate("academy", "name");
        return (allIdeaInDB = allPostWithBoth
          .sort(
            (prevIdea, nextIdea) =>
              nextIdea.reactions.filter((item) => item.reactionType === "Like")
                .length -
              nextIdea.reactions.filter((item) => item.reactionType === "Dislike")
                .length -
              prevIdea.reactions.filter((item) => item.reactionType === "Like")
                .length +
              prevIdea.reactions.filter((item) => item.reactionType === "Dislike")
                .length
          )
          .slice((page - 1) * limit, page * limit));
      case filterEnum.DATE_ASC:
        return (allIdeaInDB = await IdeaModel.find({})
          .populate("category", "name")
          .populate("magazine", "name")
          .populate("academy", "name")
          .sort({ createdAt: -1 })
          .skip((page - 1) * limit)
          .limit(limit));
      case filterEnum.DATE_DESC:
        return (allIdeaInDB = await IdeaModel.find({})
          .populate("category", "name")
          .populate("magazine", "name")
          .populate("academy", "name")
          .sort({
            createdAt: 1,
          })
          .skip((page - 1) * limit)
          .limit(limit));
      case filterEnum.MY_IDEA:
        return (allIdeaInDB = await IdeaModel.find({ user: id })
          .populate("category", "name")
          .populate("magazine", "name")
          .populate("academy", "name")
          .sort({
            createdAt: 1,
          })
          .skip((page - 1) * limit)
          .limit(limit));
      default:
        return (allIdeaInDB = await IdeaModel.find({})
          .populate("category", "name")
          .populate("magazine", "name")
          .populate("academy", "name")
          .sort({ viewCount: -1 })
          .skip((page - 1) * limit)
          .limit(limit));
    }
  };

  module.exports = {
    getAllIdeaWithFilter,
  };