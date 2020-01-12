const express=require('express');
const router=express.Router();

router.get('/',(req,res)=>{
res.json({question:"Where is ram JI"});
});

module.exports=router;