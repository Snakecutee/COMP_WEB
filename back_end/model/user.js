const mongoose = require("mongoose");
const CryptoJS = require("crypto-js");

const UserSchema = new mongoose.Schema(
  {
    avatar: { type: String, required: false },
    username: { type: String, required: true },
    password: {
      type: String,
      required: true,
      default: process.env.DEFAULT_PASSWORD,
    },
    fullname: { type: String, required: true },
    email: {
      type: String,
      required: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    },
    dateOfBirth: { type: Date, required: false },
    address: { type: String, required: true },
    age: { type: Number, required: false },
    department: { type: String, required: false },
    gender: {
      type: String,
      required: false,
      enum: ["Male", "Female", "Unkown"],
    },
    role: {
      type: String,
      required: true,
      enum: [
        process.env.MARKETINGCOORDINATOR,
        process.env.ADMIN,
        process.env.MARKETINGMANAGER,
        process.env.STUDENT,
      ],
      default: process.env.STUDENT,
    },
    avatar: String,
    deleted: { type: Boolean, required: false, default: false },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  try {
    const user = this;
    user.age =
      new Date().getFullYear() - new Date(user.dateOfBirth).getFullYear();
    if (!user.isModified("password")) {
      next();
    }
    user.password = CryptoJS.AES.encrypt(
      user.password,
      process.env.ENCRYPT_KEY
    ).toString();
    next();
  } catch (error) {
    next(error);
  }
});

UserSchema.methods.validatePassword = async function (password, next) {
  try {
    const decrypted = CryptoJS.AES.decrypt(
      this.password,
      process.env.ENCRYPT_KEY
    );
    const rawPassword = decrypted.toString(CryptoJS.enc.Utf8);
    if (rawPassword === password) {
      return next(null, this);
    } else {
      return next(null, false);
    }
  } catch (error) {
    return next(error);
  }
};

UserSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    // remove these props when object is serialized
    delete ret._id;
    delete ret.password;
  },
});

const UserModel = mongoose.model("Users", UserSchema);

module.exports = UserModel;
