const express = require("express");
const multer = require("multer");
const router = express.Router();
const s3 = require("../config/s3");
const fs = require("fs");
const { protect } = require("../middleware/authMiddleware");
const upload = multer({ dest: "uploads/" });
const Image = require("../Models/imageModel");
const util = require("util");
const unlinkFile = util.promisify(fs.unlink);

// upload image
router.post("/upload", protect, upload.single("image"), async (req, res) => {
  const file = req.file;
  if (!file) {
      return res.status(400).json("image missing");
  }
  const filestream = fs.createReadStream(file.path);
  const params = {
      bucket: process.env.AWS_BUCKET_NAME,
      key: file.filename,
      Body: filestream,
  };

  s3.upload(params).promise().then((data) => {
      // save image to db
      const newImage = new Image({
          url: data.Location,
          description: req.body.description,
      });
      newImage.save();
      unlinkFile(file.path);
      return res.status(200).json(data);
  }
  ).catch((err) => {
      console.log(err);
      return res.status(500).json(err);
  });
});

// get image
router.get("/get/:key", protect, async (req, res) => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: req.params.key,
  };
  s3.getObject(params)
    .promise()
    .then((data) => {
      return res.status(200).json(data);
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json(err);
    });
});

// get all images
router.get("/images", protect, async (req, res) => {
  Image.find({}, (err, images) => {
    if (err) {
      return res.status(500).json(err);
    }
    return res.status(200).json(images);
  });
});

// delete image
router.delete("/delete/:ImageId", protect, async (req, res) => {
  try {
    const imageId = req.params.ImageId;

    // delete image from s3
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: imageId,
    };
    await s3.deleteObject(params).promise();

    // delete image from db
    await Image.findByIdAndDelete(imageId);
    return res.status(200).json("image deleted");
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

module.exports = router;
