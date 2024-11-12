const express = require('express');
const router = express.Router();
const fetchContentcontroller=require('../controllers/aws');
// router.post('/',fetchContentcontroller);
router.post('/fetch-content',fetchContentcontroller);
module.exports=router;