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
      const { username, department } = req.query;
      if(username && department) {
        const result = await getUserByDepartment(department, username);
        res.status(200).json(result);
        return;
      }
      if (username) {
        const result = await getUserByUsername(username);
        res.status(200).json(result);
        return;
      } else if (department) {
        const result = await getUserByDepartment(department);
        res.status(200).json(result);
        return;
      } else {
        const user = await getAllUser();
        res.status(200).json(user);
      }
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
  