const express=require('express');
const router=express.Router();
var bcrypt=require('bcryptjs');
var jsonwt=require('jsonwebtoken');
var passport=require('passport');
const key=require('../../setup/myurl');
var db=require('../../setup/db');
var path=require('path');
var multer=require('multer');
var upload = multer({dest: './public/images'});
const verifyToken = require('../../strategies/jsonwtStategy');


router.get('/',(req,res)=>{
  res.render('main/home');
});


//@type   GET
//@route  /api/auth/register
//@desc   route for registration of user
//@access  Public

router.get('/register',(req,res)=>{

  res.render('main/register');

});

//@type   POST
//@route  /api/auth/register
//@desc   route for registration of user
//@access  Public
router.post('/register',upload.single('profilepic'),(req,res)=>{
var sql="select email from person where email= ?";
var email=req.body.email;
console.log(req.body.email);
db.query(sql,email,(err,row)=>{
  if(row.length>0){
     res.render('main/register');
  }else {
      
           
       // Check Image Upload
	  if(req.file){
      var profilepic = req.file.filename
      console.log("profilename:"+profilepic)
	  } else {
	    var profilepic = 'noimage.jpg';
	  }

	   // Form Field Validation
  		// req.checkBody('name', 'name field is required').notEmpty();
  		// req.checkBody('email', 'email field is required').isEmail();
      // req.checkBody('password', 'Password field is required').notEmpty();
  		var errors = 0;//req.validationErrors();
       
      if(errors){
        res.render('main/register', 
        //{
          //   errors: errors,
          //   tit: title,
          //   description: description,
          //   service: service,
          //   client: client,
          //   url: url
          // }
          );
      } else {
        var newPerson  = {
          name: req.body.name,
          email: email,
          password: req.body.password,
          profilepic:profilepic,
          username:req.body.username,
        };
      }
      //Encrypt password using bcrypt
      bcrypt.genSalt(10,(err, salt)=> {
        bcrypt.hash(newPerson.password, salt, function(err, hash) {
            if(err) throw err;
            // Store hash in your password DB.
            newPerson.password=hash//hash has new password
    
            //insert into data base
            var sql='INSERT INTO person SET ?'
             db.query(sql, newPerson, function(err, row){
                console.log('Error: '+err);
                console.log('Success: '+row);
               });

        });
    });

  }//end of else
});//end of query
//redirect if success
res.redirect(301,'/login');
});

//@type   GET
//@route  /api/auth/login
//@desc   route for login of user
//@access  Public

router.get('/login',(req,res)=>{
res.render('main/login');

});

//@type   POST
//@route  /api/auth/login
//@desc   route for login of user
//@access  Public

router.post('/login',(req,res)=>{
 
 const email=req.body.email;
 
 const password=req.body.password;
var sql='SELECT * FROM person WHERE email=?';//row contain full row with matcing email

db.query(sql,[email],(err,row)=>{
  if (err) throw err;
 //console.log(row);
//check wheathr row array empty or not
if(row.length>0){ 
  console.log("ROW"+row);
//compare password
bcrypt.compare(password, row[0].password)
.then((isCorrect) => {
  if (isCorrect) {
    // res.json({ success: "User is able to login successfully" });
    //use payload and create token for user
    const payload = {
      id: row[0].id,
      name: row[0].name,
      email: row[0].email
    };
   var  username=row[0].username;
   console.log(username);
    jsonwt.sign(
      payload,
      key.secret,
      { expiresIn: 3600 },
      (err, token) => {
        // res.render('main/home');
        if(err) console.log("Error in jwt.sign");
        //return res.json({payload, token});
   
        res.cookie('jwt',token);
        res.redirect(`/${username}`);

    //  res.cookie("cookie",{ 
    //       success: true,
    //       token: `Bearer ${token}` }).json({success: true,
    //         token: `Bearer ${token}`});
      }
    );
  } else {
      console.log("Login:Password not match");
    res.render('main/login');   //password not match
  }


}).catch(err=>console.log("Error bcrypt:"+err));//end of bcrypt


}else{
  console.log("Login:mail not match");
  res.render('main/login'); //mail not found
}

});//End of query

});//end of login route


////@type   GET
//@route  /api/auth/profile
//@desc   route for user profile
//@access  private
//passport.authenticate("jwt",{session:false})
router.get('/profile',passport.authenticate("jwt",{session:false}),(req,res)=>{
  var user=req.user[0];
  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    profilepic: user.profilepic
  });
});
module.exports=router;
