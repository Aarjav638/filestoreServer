const express = require('express');
const router = express.Router();
const {fetchContentcontroller,createFolder, uploadFiles}=require('../controllers/aws');
// router.post('/',fetchContentcontroller);
router.get('/',(req,res)=>{
    res.send('Hello from aws')
}
)

// const multer = require('multer');
// const upload = multer({
//     storage: multer.memoryStorage(),
//   });

router.post('/fetch-content',fetchContentcontroller);
router.post('/create-folder',createFolder);
// router.post('/upload-file',upload.array('files',10),uploadFiles);
module.exports=router;