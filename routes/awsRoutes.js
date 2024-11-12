const express = require('express');
const router = express.Router();
const {fetchContentcontroller,createFolder}=require('../controllers/aws');
// router.post('/',fetchContentcontroller);
router.get('/',(req,res)=>{
    res.send('Hello from aws')
}
)
router.post('/fetch-content',fetchContentcontroller);
router.post('/create-folder',createFolder);
module.exports=router;