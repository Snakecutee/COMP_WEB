const {
  createAcademicYear,
  getAcademicYear,
  getAcademicYearById,
  updateAcademicYear,
  deleteAcademy,
} = require("../service/academic.service");

const academicControler = {
  create: async (req, res) => {
    try {
      await createAcademicYear(req.body);
      res.status(200).json({ status: 200 });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },
  getAll: async (req, res) => {
    try {
      var values = await getAcademicYear();
      res.status(200).json(values);
    } catch (err) {
      console.log(err);
    }
  },
  update: async (req, res) => {
    const { id } = req.params;
    try {
      await updateAcademicYear(id, req.body);
      res.status(200).json({ message: "Update Academic Year Successfully." });
    } catch (err) {
      res.status(400).json({ message: err.message, status: 400 });
    }
  },
  getById: async (req, res) => {
    const { id } = req.params;
    try {
      var values = await getAcademicYearById(id);
      res.status(200).json(values);
    } catch (err) {
      console.log(err);
    }
  },
  deleteAcademy: async (req, res) => {
    const id = req.params.id;
    await deleteAcademy(id);
    res.status(200).json({ status: 200 });
  },
  // sendToQA: async (req, res) => {
  //   await sendToQAManager();
  //   res.json({message: "Done"})
  // }
};

module.exports = academicControler;
