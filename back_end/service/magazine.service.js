const deleteMagazine = async (id) => {
    const updatedMagazine = await MagazineModel.findOneAndUpdate(
      { _id: id },
      {
        isDelete: true,
      },
      { new: true }
    );
    return updatedMagazine;
  };

  module.exports = {
    deleteMagazine, 
  };
  