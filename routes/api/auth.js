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


router.get('/',(req,res)=>{
    res.send("HI Hanuman Ji");
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
db.query(sql,email,(err,result)=>{
  if(result.length>0){
     res.render('main/register');
  }else {
      
           
       // Check Image Upload
	  if(req.file){
	    var profilepic = req.file.filename
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
          profilepic:profilepic
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
             db.query(sql, newPerson, function(err, result){
                console.log('Error: '+err);
                console.log('Success: '+result);
               });

        });
    });

  }//end of else
});//end of query
//redirect if success
res.redirect(301,'/api/auth/login');
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
// const email=req.body.email;
// const password=req.body.password;

var sql='SELECT * FROM person WHERE email = ?';//result contain full row with matcing email
//,[email],
db.query(sql,[req.body.email],(err,row)=>{
  if (err) throw err;
console.log(row);
res.render('main/home');
//check wheathr result array empty or not
// if(result.length>0){ 
// //compare password
// bcrypt.compare(req.body.password, result[0].password)
// .then((isCorrect) => {
//   if (isCorrect) {
//     // res.json({ success: "User is able to login successfully" });
//     //use payload and create token for user
//     const payload = {
//       id: result[0].id,
//       name: result[0].name,
//       email: result[0].email
//     };
//     jsonwt.sign(
//       payload,
//       key.secret,
//       { expiresIn: 3600 },
//       (err, token) => {
//         res.render('main/home');
//       }
//     );
//   } else {
//     res.render('main/login');   //password not match
//   }


// }).catch(err=>console.log("Error bcrypt:"+err));//end of bcrypt


// }else{
//   res.render('main/login'); //mail not found
// }

});//End of query

});//end of login route

module.exports=router;
