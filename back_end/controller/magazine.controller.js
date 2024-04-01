const {
    deleteMagazine,
  } = require("../service/magazine.service");

  const magazineController = {
    deleteMagazine: async (req, res) => {
        const id = req.params.id;
        await deleteMagazine(id);
        res.status(200).json({ status: 200 });
      },
  };

  module.exports = magazineController;