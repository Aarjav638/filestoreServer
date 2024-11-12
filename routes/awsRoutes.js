const express = require('express');
const router = express.Router();
const fetchContentcontroller=require('../controllers/aws');
// router.post('/',fetchContentcontroller);
router.get('/',(req,res)=>{
    res.send('Hello from aws')
}
)
router.post('/fetch-content',fetchContentcontroller);
module.exports=router;