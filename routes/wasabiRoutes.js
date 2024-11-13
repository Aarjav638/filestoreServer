const express = require("express");
const router = express.Router();
const {
  fetchContentcontroller,
  createFolder,
  uploadFiles,
} = require("../controllers/wasabi");
router.get("/", (req, res) => {
  res.send("Hello from aws");
});

const multer = require("multer");
const upload = multer({
  storage: multer.memoryStorage(),
},
).array('files',10);

router.post("/fetch-content", fetchContentcontroller);
router.post("/create-folder", createFolder);
router.post("/upload-file", (req, res, next) => {
  upload(req, res, (err) => {
      if (err instanceof multer.MulterError) {
          res.status(404).send(err.code + 'Upload failed due to multer error');
      } else if (err) {
          res.status(404).send(err + 'Upload failed due to unknown error');
      }
      next();
  });
},uploadFiles);
module.exports = router;
