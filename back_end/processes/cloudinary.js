const cloudinary = require("cloudinary").v2;

cloudinary.config({
  api_key: "498143329584292",
  api_secret: "yFWWlwI7nOMI_VRFOsV05nsKxYc",
  cloud_name: "dvokjjmpr",
});
const uploadDocument = async (filePath, filename) => {
  try {
    const uploadResult = await cloudinary.uploader.upload(filePath, {
      folder: "documents",
      resource_type: "raw",
      public_id: `${filename}`,
    });
    return uploadResult;
  } catch (error) {
    console.log(error);
  }
};

module.exports = { uploadDocument };
