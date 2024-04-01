const {
  createMagazine,
  updateMagazine,
  getAllMagazineFilterDepartment,
  deleteMagazine,
  getAllMagazine,
  getById,
} = require("../service/magazine.service");

const magazineController = {
  getAllMagazine: async (req, res) => {
    const magazines = await getAllMagazine();
    res.status(200).json(magazines);
  },
  getMagazineByDepartment: async (req, res) => {
    const department = req.user.department;
    const magazines = await getAllMagazineFilterDepartment(department);
    res.status(200).json(magazines);
  },
  createMagazine: async (req, res) => {
    const createdMagazine = await createMagazine(req.body);
    res
      .status(201)
      .json({ message: "Magazine Created", data: createdMagazine });
  },
  updateMagazine: async (req, res) => {
    const updatedMagazine = await updateMagazine(req.body);
    res
      .status(201)
      .json({ message: "Magazine Updated", data: updatedMagazine });
  },
  deleteMagazine: async (req, res) => {
    const id = req.params.id;
    await deleteMagazine(id);
    res.status(200).json({ status: 200 });
  },
  getMagazineById: async (req, res) => {
    const id = req.params.id;
    const result = await getById(id);
    res.status(200).json(result);
  },
};
module.exports = magazineController;
