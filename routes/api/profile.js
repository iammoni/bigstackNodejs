const express=require('express');
const router=express.Router();
var db=require('../../setup/db');
let passport=require('passport');



router.get('/',passport.authenticate("jwt",{session:false}),(req,res)=>{

let id=1;//req.user.id;

var sql="select * from profiles where id=?";
db.query(sql,id,(err,result)=>{
    
    if(err) throw err;
    if(result.length>0){
        console.log("Profile for Update Found!");
       res.render('main/profile');
    }
    else{
        console.log('Create Profile:');
        res.render('main/profile');
    }
});

});

router.post('/',/*passport.authenticate({session:false}),*/(req,res)=>{

    const profileValues = {};
    profileValues.id =  1;// req.user.id;
    console.log("req.body:"+req.body.username);
    if (req.body.username) profileValues.username = req.body.username;
    if (req.body.country) profileValues.country = req.body.country;
    if (req.body.languages) profileValues.languages = req.body.languages;
    // if (typeof req.body.languages !== undefined) {
    //   profileValues.languages = req.body.languages.split(",");
    // }
    //get social links
    // profileValues.social = {};

    // if (req.body.youtube) profileValues.social.youtube = req.body.youtube;
    // if (req.body.facebook) profileValues.social.facebook = req.body.facebook;
    // if (req.body.instagram) profileValues.social.instagram = req.body.instagram;
     
     //add to database &update if want to update
    
  var sql='select * from profiles where id=1';
 
  db.query(sql,(err,result)=>{
    if (err) throw err;  
    if(result.length>0){
        
        var sql = "UPDATE profiles SET ?";
        db.query(sql,profileValues,(err,result)=>{
         
            if(err) console.log("Error in Upadte:"+err);
            else{
                console.log("Success :"+result);
            } 

        });
    }else{
            let sql='select * from profiles where username=?';
            db.query(sql,req.body.username,(req,row)=>{
                if(err) console.log("Error in Save:"+err)
                if(row.length>0){
                   res.json({username:"Username is already present"});
               }else{
                db.query('INSERT INTO profiles SET ?', profileValues, function(err, result){
                    console.log('Error: '+err);
                    console.log('Success Insert: '+result);
                   });
                
               } 
            });
    }
       
  });
});

module.exports=router;