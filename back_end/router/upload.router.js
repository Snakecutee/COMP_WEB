const upload = require("express").Router();
const fs = require("fs");
const path = require("path");
const multer = require("multer");

const uploadDir = path.join(__dirname, "../statics/images");

fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); // This is where the files would be saved
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname); // This is how the files would be named
  },
});

const fileFilter = (req, file, cb) => {
  // accept all files
  cb(null, true);
};

const uploader = multer({
  storage: storage,
  fileFilter: fileFilter,
});

upload.post("/", uploader.single("file"), (req, res, next) => {
  console.log("day la req.file", req.file);
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const fileType = req.file.mimetype.split("/")[0];

  if (fileType === "image") {
    const relativeImagePath = path.relative(process.cwd(), req.file.path);
    return res.status(200).json({
      message: "Image uploaded successfully",
      path: relativeImagePath,
    });
  } else {
    const relativeFilePath = path.relative(process.cwd(), req.file.path);
    return res.status(200).json({
      message: "File uploaded successfully",
      path: relativeFilePath,
    });
  }
});

module.exports = upload;
