const {
    getAllUser,
    getUserByUsername,
    getUserById,
    updateUser,
    deleteUser,
    reactiveUser,
  } = require("../service/user.service.js");
  
  const userController = {
    getAllUser: async (req, res) => {
      const user = await getAllUser();
      console.log(user);
        res.status(200).json(user);
    },
    getUserById: async (req, res) => {
      const id = req.params.id;
      const result = await getUserById(id);
      res.status(200).json(result);
    },
    update: async (req, res) => {
      try {
        const { id } = req.params;
        await updateUser(id, req.body);
        res.status(200).json({ status: 200 });
      } catch (err) {
        console.log(err);
      }
    },
    delete: async (req, res) => {
      try {
        const { id } = req.params;
        await deleteUser(id);
        res.status(200).json({ status: 200 });
      } catch (err) {
        console.log(err);
      }
    },
    reactive: async (req, res) => {
      try {
        const { id } = req.params;
        await reactiveUser(id);
        res.status(200).json({ message: "Account actived" });
      } catch (error) {
        res.status(400).json({ message: error.message });
  
      }
    }
  };
  
  module.exports = userController;
  