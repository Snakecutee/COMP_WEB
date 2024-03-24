const multer = require("multer");

const excelFilter = (req, file, cb) => {
  if (
    file.mimetype.includes("excel") ||
    file.mimetype.includes("spreadsheetml")
  ) {
    cb(null, true);
  } else {
    cb("Please upload only excel file.", false);
  }
};

const ExcelStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./statics/excels");
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.toLowerCase().split(" ").join("-");
    cb(null, fileName);
  },
});

const documentFilter = (req, file, cb) => {
    if (
      file.mimetype.includes("application/msword") ||
      file.mimetype.includes("application/vnd.openxmlformats") ||
      file.mimetype.includes("application/pdf") ||
      file.mimetype.includes("officedocument.wordprocessingml.document") ||
      file.mimetype.includes("text/markdown")
    ) {
      cb(null, true);
    } else {
      cb("Only accept docx, doc and pdf.", false);
    }
}

const DocumentStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './statics/documents');
    },
    filename: (req, file, cb) => {
      console.log(file.originalname);
         const fileName =
           req.user.fullname.split(" ").join("-") +
           "-" + req.user.id +
           "-" +
           Date.now().toString()
           +
           "-support-document." + file.originalname.split('.')[1];
         cb(null, fileName);
    }
})


const uploadExcel = multer({
  storage: ExcelStorage,
  fileFilter: excelFilter,
});



const uploadDocument = multer({
    storage: DocumentStorage,
    fileFilter: documentFilter,
})

module.exports = {uploadExcel, uploadDocument};
