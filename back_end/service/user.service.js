const User = require("../model/user");
const fs = require("fs");
const { register } = require("./auth.service");
const CryptoJS = require("crypto-js");

const getAllUser = async () => {
  const qaManager = await User.findOne({ role: process.env.QAMANAGER })
    .sort([["createdAt", "asc"]])
  const userDb = await User.find({ role: process.env.STAFF })
    .sort([["createdAt", "asc"]])

  return [qaManager, ...userDb];
};

const getUserByUsername = async (username) => {
   const qaManager = await User.findOne({
     role: process.env.QAMANAGER,
     fullname: new RegExp(username, "i"),
   });
  const listUserInDb = await User.find({role: process.env.STAFF, fullname: new RegExp(username, 'i')})
    .sort([["createdAt", "asc"]])
    if(qaManager) {
      return [qaManager, ...listUserInDb]
    }
    return listUserInDb;
};

const getUserById = async (id) => {
  return await User.findById(id);
};

const updateUser = async (id, updateAccount) => {
  console.log("putt" + updateAccount);
  const {
    password,
    confirmPassword,
    fullname,
    dateOfBirth,
    address,
    age,
    gender,
  } = updateAccount;
  if (password !== confirmPassword) {
    throw new Error("Password and confirm password is not match");
  } else {
    try {
      var encryptedPassword = CryptoJS.AES.encrypt(
        password,
        process.env.ENCRYPT_KEY
      ).toString();

      await User.findByIdAndUpdate(id, {
        fullname: fullname,
        password: encryptedPassword,
        dateOfBirth: dateOfBirth,
        address: address,
        age: age,
        gender: gender,
      });
    } catch (error) {
      if (error.name === "ValidationError") {
        let errors = {};

        Object.keys(error.errors).forEach((key) => {
          errors[key] = error.errors[key].message;
        });
        console.log(errors);

        throw new Error(errors);
      }
    }
  }
};

const deleteUser = async (id) => {
  await User.findByIdAndUpdate(id, { deleted: true });
};

const reactiveUser = async (id) => {
  await User.findByIdAndUpdate(id, {deleted: false});
}


module.exports = {
  getAllUser,
  getUserByUsername,
  getUserById,
  updateUser,
  deleteUser,
  reactiveUser
};
