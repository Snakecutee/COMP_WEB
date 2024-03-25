const db = {};
const mongoose = require("mongoose");
const User = require("../model/user");

mongoose.Promise = global.Promise;

db.mongoose = mongoose;

db.seedData = async () => {
  try {
    const userInDbCount = await User.estimatedDocumentCount();
    if (!userInDbCount) {
      const admin = new User({
        avatar: "statics/images/avatar.png",
        username: "admin",
        password: "admin123",
        fullname: "Administrator",
        dateOfBirth: new Date(),
        email: "admin123@gmail.com",
        age: 21,
        gender: "Male",
        role: process.env.ADMIN,
      });
      await admin.save();
      const userTest1 = await new User({
        avatar: "statics/images/avatar.png",
        username: "marketingmanager@gmail.com",
        password: "123456",
        fullname: "marketing Manager",
        email: "markertingmanager@gmail.com",
        dateOfBirth: new Date(),
        age: 21,
        gender: "Male",
        role: process.env.MARKETINGMANAGER,
      });
      await userTest1.save();
      const userTest2 = await new User({
        avatar: "statics/images/avatar.png",
        username: "marketingcoordinator",
        password: "123456",
        fullname: "marketing Coordinator",
        email: "marketingcoordinator@gmail.com",
        dateOfBirth: new Date(),
        age: 21,
        gender: "Male",
        department: "IT Major",
        role: process.env.MARKETINGCOORDINATOR,
      });
      await userTest2.save();
      const userTest3 = await new User({
        avatar: "statics/images/avatar.png",
        username: "STUDENT",
        password: "123456",
        fullname: "STUDENT",
        email: "STUDENT@gmail.com",
        dateOfBirth: new Date(),
        age: 21,
        gender: "Male",
        department: "IT Major",
        role: process.env.STUDENT,
      });
      await userTest3.save();
      console.log("Account seeded");
    }
  } catch (error) {
    console.error(error);
  }
};

db.connect = async (dbConnectionUrl) => {
  try {
    await mongoose.connect(dbConnectionUrl, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    await db.seedData();
    console.log("DB connected");
  } catch (error) {
    console.error(`Connecting error: ${error}`);
  }
};

module.exports = db;
