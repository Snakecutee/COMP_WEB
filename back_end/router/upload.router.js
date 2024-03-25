const upload = require('express').Router();
const fs = require('fs');
const path = require('path');
const multer = require('multer');


const uploadDir = path.join(__dirname, '../statics/images');

fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); // This is where the files would be saved
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname); // This is how the files would be named
  }
});

const fileFilter = (req, file, cb) => {
  // accept all files
  cb(null, true);
};

const uploader = multer({
  storage: storage,
  fileFilter: fileFilter
});

upload.post('/', uploader.single('image'), (req, res, next) => {
  console.log(req.file);
  const relativePath = path.relative(process.cwd(), req.file.path);
  res.status(200).json({
    message: 'Image uploaded successfully',
    path: relativePath
  });
});


module.exports = upload;