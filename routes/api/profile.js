const express=require('express');
const router=express.Router();
var db=require('../../setup/db');
let passport=require('passport');


//@type   GET
//@route  /api/profile
//@desc   route for user profile
//@access  private
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


//@type   POST
//@route  /api/profile
//@desc   route for user profile
//@access  private
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


//@type   GET
//@route  /api/profile/:username
//@desc   route for getting user profile using username
//@access  PUBLIC

router.get('/',(req,res)=>{
   var username=req.params.username;
   var sql='select * from profiles where id=?';
   db.query(sql,[username],(err,profile)=>{
     
    if(err) throw err;
    if(profile.length>0){
        res.json(profile);
    }else{
        res.json({Error:"Profile not found"});
    }
   });
});

//@type   GET
//@route  /api/profile/find/everyone
//@desc   route for getting user profile using username
//@access  PUBLIC

router.get('/',(req,res)=>{
    var username=req.params.username;
    var sql='select * from profiles';
    db.query(sql,(err,profile)=>{
      
     if(err) throw err;
     if(profile.length>0){
         res.json(profile);
     }else{
         res.json({Error:"Profile not found"});
     }
    });
 });

 //@type   GET
//@route  /api/profile/find/everyone
//@desc   route for getting user profile using username
//@access  PRIVATE

router.delete('/',passport.authenticate({session:false}),(req,res)=>{

    var id=req.user.id;
    var sql = "DELETE FROM profiless WHERE address =?";
  db.query(sql,[id], function (err, result) {
    if (err) throw err;
    console.log("Number of records deleted from PROFILES: " + result.affectedRows);
  });

  var sql1 = "DELETE FROM person WHERE address =?";
  db.query(sql1,[id], function (err, result) {
    if (err) throw err;
    console.log("Number of records deleted FROM PERSON: " + result.affectedRows);
  });
});

module.exports=router;