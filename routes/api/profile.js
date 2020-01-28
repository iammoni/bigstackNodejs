const express=require('express');
const router=express.Router();
var db=require('../../setup/db');
let passport=require('passport');
var url=require('url');
var multer = require('multer');

const { check, validationResult } = require('express-validator');
// var storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null,  './public/images/portfolio')
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + file.originalname)
//   }
// });

var upload = multer({dest: './public/images/portfolio'});
//var upload = multer({ storage: storage });
// //@type   GET
// //@route  /api/profile
// //@desc   route for user profile
// //@access  private
// router.get('/',passport.authenticate("jwt",{session:false}),(req,res)=>{

//     var user=req.user[0];

// var sql="select * from profiles where id=?";
// db.query(sql,user.id,(err,result)=>{
    
//     if(err) throw err;
//     if(result.length>0){
//         console.log("Profile for Update Found!");
//        res.render('main/profile');
//     }
//     else{
//         console.log('Create Profile:');
//         res.render('main/profile');
//     }
// });

// });
//@type   GET
//@route  /:username
//@desc   route for user profile
//@access  private
router.get('/',passport.authenticate("jwt",{session:false}),(req,res)=>{

    var user=req.user[0];
     
      var username=req.originalUrl.replace('/',''); 
        var sql="select * from profiles where id=?";
       db.query(sql,user.id,(err,row,fields)=>{
    
        if(err) throw err;
       if(row.length>0){
           if(row[0].username===username){
           // console.log(row[0].username);
        //console.log("Profile userHome Found!");
        //console.log(row[0].profilepic)
      sql="select * from profiles where id=?";

      db.query(sql,user.id,(err,profile,fields)=>{
           if(err) console.log("Error:"+err);
          const profileValues={};
           if(profile[0].id) profileValues.id=profile[0].id;
           if(profile[0].username) profileValues.username=profile[0].username;
           if(profile[0].name) profileValues.name=profile[0].name;
           if(profile[0].email) profileValues.email=profile[0].email;
           if(profile[0].profilepic) profileValues.profilepic=profile[0].profilepic;
           if(profile[0].usertel) profileValues.usertel=profile[0].usertel;
           if(profile[0].about_user) profileValues.about_user=profile[0].about_user;
           //arrays ha

           
           if(profile[0].skill)
           {   var skills=[];

            var arr=profile[0].skill.split(',');
            for(var i=0;i<arr.length;i++){
            str=arr[i];
            var value=Number(str.slice(str.indexOf('(')+1,str.length-1));
            var name=str.slice(0,str.indexOf('('));
 
              var obj={name:name,value:value};
              skills.push(obj);
             }
              profileValues.skills=skills;
            }
           if(profile[0].languages) profileValues.languages=profile[0].languages.split(',');
           if(profile[0].workrole) profileValues. workrole=profile[0].workrole.split(',');
           if(profile[0].social) profileValues.social=profile[0].social.split(',');
           if(profile[0].images) profileValues.images=profile[0].images.split(';');

           console.log(profileValues);

        db.query("SELECT * FROM projects where user_id=?",user.id, function(err, rows, fields){
          
            if(err) throw err;
          return  res.render('main/home',{
             "profile":profileValues,
             "projects":rows,
       });
    });//End of Projects
  });//End of profile
    }
    else
    {
        console.log('Redirected to home 1:');
        res.redirect('/');
      }
       }
       else{
        console.log('Redirected to home 2:');
         res.redirect('/');
      }
   });//End of person 
});

 //@type   GET
// @route  /:username/profile
// @desc   route for profile
// @access  PRIVATE

router.get('/profile',(req,res)=>{
  // var username=req.params.username;
    var username=req.originalUrl;
    username=username.substr(1,username.length);
    username=username.substr(0,username.indexOf('/'));
    var sql='select * from profiles where username=?';
    db.query(sql,username,(err,person)=>{
     
    if(err) throw err;
    if(person.length>0){
        res.render('main/profile',{
        person:person[0],
        });
    }else{
        res.json({Error:"No such user exist"});
    }
   });
});
// @type   POST
// @route  /:username/profile
// @desc   route for user profile
// @access  private
router.post('/profile',upload.array('images',12),passport.authenticate("jwt",{session:false}),(req,res)=>{
       //req.files is array of objects
       //console.log(req.files);
    const profileValues = {};
    
   // console.log(req.user[0]);
   // console.log("req.body:"+req.user[0].id);
    if(req.user[0].id)  profileValues.id=req.user[0].id;
    if (req.user[0].username) profileValues.username = req.user[0].username;
    if(req.user[0].name)  profileValues.name=req.user[0].name;
    if(req.user[0].email)  profileValues.email=req.user[0].email;
    if(req.user[0].password)  profileValues.password=req.user[0].password;
    if(req.user[0].profilepic)  profileValues.profilepic=req.user[0].profilepic;
    
    if(req.body.usertel)  profileValues.usertel=req.body.usertel;
    if(req.body.about_user)  profileValues.about_user=req.body.about_user;
    if(req.body.skill)  profileValues.skill=req.body.skill;
    if (req.body.country) profileValues.country = req.body.country;
    if (req.body.languages) profileValues.languages = req.body.languages;
    if (req.body.workrole) profileValues.workrole = req.body.workrole;
    if(req.body.social)  profileValues.social=req.body.social;
    
        var set="";

         // Check Image Upload
	       if(req.files){
         var arr=req.files;
           var images='';
           for(var i=0;i<arr.length;i++){

              images+=';'+arr[i].filename;
            }

        images=images.substr(1,images.length);
        // console.log("IMages:")
        // console.log(images);
         profileValues.images=images;
         //var set=`usertel=${req.body.usertel}`;//,about_user=${req.body.about_user},skill=${req.body.skill},country=${req.body.country},languages=${req.body.languages},workrole=${req.body.workrole},social=${req.body.social},images=${req.body.images}`;

	       } else {
          images=profileValues.images = 'noimage.jpg';
          //var set=`usertel=${req.body.usertel}`;//,about_user=${req.body.about_user},skill=${req.body.skill},country=${req.body.country},languages=${req.body.languages},workrole=${req.body.workrole},social=${req.body.social},images=${req.body.images}`;

	         }
          
        
         console.log("Profile:");
          console.log(profileValues);
          console.log(set);
     
    // if (typeof req.body.languages !== undefined) {
    //   profileValues.languages = req.body.languages.split(",");
    // }
   // get social links
    // var  profileValues={
    //      id: 12,
    //      username: 'idiot',
    //      name: 'idiot',
    //      email: 'idiot@gmail.com',
    //      password: '$2a$10$nybDxZeEDr7Fdt60XNuTn.JGHFTETYJAygEgNP0uykZtgwIkjMGhS',
    //      profilepic: 'b0a7dfa652f4d9120a6ba14fd90a572b',
    //      usertel: '9991272800',
    //      about_user: 'i am an idiot.',
    //      skill: 'JavaScript(34),Nodejs(45),AngularJs(89)',
    //      country: 'India',
    //      languages: 'Urdu',
    //      workrole: 'Software Engineer',
    //      social: 'https://youtube.com,https://facebook.com/sd,https://snapchat.com/ap',
    //      images: 'f1985099aa756857375e1b6b89b0aea9;7da97cfc1e46aaf52232ff3809d62327;6377027f4ac921039cbe58423e1d6f25'
    //    };

    // if (req.body.youtube) profileValues.social.youtube = req.body.youtube;
    // if (req.body.facebook) profileValues.social.facebook = req.body.facebook;
    // if (req.body.instagram) profileValues.social.instagram = req.body.instagram;
     
   // add to database &update if want to update

   var sql='select * from profiles where id=?';
   
  db.query(sql,req.user[0].id,(err,result,fields)=>{
    if (err) throw err; 
    console.log(result) 
    if(result.length>0){
        
       // var sql1 = "UPDATE profiles SET profileValues where id=?;
        var sql1="UPDATE profiles SET ? where id=?";
        console.log("SQL Update:"+sql1);
        db.query(sql1,[profileValues,req.user[0].id],(err,row,fields)=>{
         
            if(err) console.log("Error in Upadte:"+err);
            else{
                console.log("Success :"+row);
            } 

        });
     }
     else{
       console.log("Please login first");
       return res.redirect('/register');
     }
    });
 
   
       
      // else{
      //   return res.redirect('/register');
      // }
     //else{
    //         // let sql='select * from profiles where username=?';
    //         // db.query(sql,req.user[0].username,(err,rows)=>{
    //         //     if(err) console.log("Error in Save:"+err)
    //         //     if(rows.length>0){
    //         //        res.json({username:"Username is already present"});
    //         //    }else{
    //             profileValues.id =req.user[0].id;
    //             db.query('INSERT INTO profiles SET ?', profileValues, function(err, result){
    //                 console.log('Error: '+err);
    //                 console.log('Success Insert: '+result);
    //                });
                
    //            } 
           // });
    //}
       

  res.redirect(`/${req.user[0].username}`);
});

////Add project
//@type   GET
//@route  /:username/project/add
//@desc   route to add project
//@access  private
router.get('/project/add', function(req, res, next) {
  
  // function fullUrl(req) {
  //   return url.format({
  //     protocol: req.protocol,
  //     host: req.get('host'),
  //     pathname: req.originalUrl
  //   });
  // }
  //  var adr=fullUrl(req);
  // var q = url.parse(adr, true);
     
     
  //   var username=q.pathname.replace('/','');

   name=req.originalUrl.substr(1,req.originalUrl.length);
   name=name.substr(0,name.indexOf('/'));
   console.log(name);
	 res.render('admin/add',{
    username:name,
  });
});


//@type   POST
//@route  /:username/project/add
//@desc   route for add project
//@access  private
 router.post('/project/add',/*[check('title', 'Title field is required').notEmpty(),
check('service', 'Service field is required').notEmpty()],*/ upload.single('projectimage'), function(req, res, next) {
      // Get Form Values
    var  name=req.originalUrl.substr(1,req.originalUrl.length);
    name=name.substr(0,name.indexOf('/'));
    db.query('select id from profiles where username=?',name,(err,id)=>{
       if (err) throw err;
       if(id.length>0){
        var userId=(id[0].id).toString();
      

    console.log(userId);

    
	  var title     = req.body.title;
	  var description = req.body.description;
	  var service   = req.body.service;
	  var url   = req.body.url;
	  var client    = req.body.client;
	  var projectdate = req.body.projectdate;

	  // Check Image Upload
	  if(req.file){
	    var projectImageName = req.file.filename
	  } else {
	    var projectImageName = 'noimage.jpg';
	  }

	   // Form Field Validation
  		// req.check('title', 'Title field is required').notEmpty();
  		// req.check('service', 'Service field is required').notEmpty();

  		var errors = 0;//req.validationErrors();

  		if(errors){
	    res.render('/project/add', {
          errors: errors,
          user_id:userId,
	        title: title,
	        description: description,
	        service: service,
	        client: client,
	        url: url
	      });
	  } else {
	    var project  = {
          user_id:userId,
	        title: title,
	        description: description,
	        service: service,
	        client: client,
	        date: projectdate,
	        url: url,
	        image: projectImageName
	      };
	  }

	  var query =db.query('INSERT INTO projects SET ?', project, function(err, result){
       console.log('Error: '+err);
       console.log('Success: '+result);
      });

      //req.flash('success_msg', 'Project Added');
      // function fullUrl(req) {
      //   return url.format({
      //     protocol: req.protocol,
      //     host: req.get('host'),
      //     pathname: req.originalUrl
      //   });
      // }
      //  var adr=fullUrl(req);
      // var q = url.parse(adr, true);
         
         
       // var username=req.originalUrle.replace('/',''); 
      //   console.log(username);
      //   var parseUrl=username.split('/');
      //   username=parseUrl[0];

    //  name=req.originalUrl.substr(1,req.originalUrl.length);
    //  var username=name.substr(0,name.indexOf('/'));
    //   console.log('redirect after project add'+username);
      // res.redirect(`/${username}/#about`);
    }
  });
  console.log("Redirect to   "+name);
  res.redirect(`/${name}/#about`);
});


///edit
router.get('/project/edit/:id', function(req, res, next) {
   name=req.originalUrl.substr(1,req.originalUrl.length);
    name=name.substr(0,name.indexOf('/'));
    console.log(name);
   db.query("SELECT * FROM projects WHERE id = ?", req.params.id, function(err, rows, fields){
    	if(err) throw err;
    	res.render('admin/edit', {
        "project": rows[0],
         username:name,
         id:req.params.id,
    	});
    });
});

router.post('project/edit/:id', upload.single('projectimage'), function(req, res, next) {
    // Get Form Values
  var title     = req.body.title;
  var description = req.body.description;
  var service   = req.body.service;
  var url   = req.body.url;
  var client    = req.body.client;
  var projectdate = req.body.projectdate;

  // Check Image Upload
  if(req.file){
    var projectImageName = req.file.filename
  } else {
    var projectImageName = 'noimage.jpg';
  }

   // Form Field Validation
      req.checkBody('title', 'Title field is required').notEmpty();
      req.checkBody('service', 'Service field is required').notEmpty();

      var errors = req.validationErrors();

       if(req.file){
          if(errors){
        res.render('admin/add', {
            errors: errors,
            title: title,
            description: description,
            service: service,
            client: client,
            url: url
          });
      } else {
        var project  = {
            title: title,
            description: description,
            service: service,
            client: client,
            date: projectdate,
            url: url,
            image: projectImageName
          };
      }
    } else {
        if(errors){
        res.render('admin/add', {
            errors: errors,
            title: title,
            description: description,
            service: service,
            client: client,
            url: url
          });
      } else {
        var project  = {
            title: title,
            description: description,
            service: service,
            client: client,
            date: projectdate,
            url: url
          };
      }
    }

  var query =db.query('UPDATE projects SET ? WHERE id = '+req.params.id, project, function(err, result){
   console.log('Error: '+err);
   console.log('Success: '+result);
  });

  req.flash('success_msg', 'Project Updated');

  res.redirect('api/admin');
});


router.delete('/delete/:id', function (req, res) {
    db.query('DELETE FROM projects WHERE id = '+req.params.id, function (err, result) {
       if (err) throw err;
         console.log('deleted ' + result.affectedRows + ' rows');
     });
      // req.flash('success_msg', "Project Deleted");
       res.sendStatus(200);
   });



// // //@type   GET
// // //@route  /api/profile/:username
// // //@desc   route for getting user profile using username
// // //@access  PUBLIC

// // // router.get('/:username',(req,res)=>{
// // //    var username=req.params.username;
// // //    var sql='select * from profiles where username=?';
// // //    db.query(sql,username,(err,profile)=>{
     
// // //     if(err) throw err;
// // //     if(profile.length>0){
// // //         res.json(profile);
// // //     }else{
// // //         res.json({Error:"Profile not found"});
// // //     }
// // //    });
// // // });

// // //@type   GET
// // //@route  /api/profile/find/everyone
// // //@desc   route for getting user profile using username
// // //@access  PUBLIC

// // router.get('/find/everyone',(req,res)=>{
// //     console.log(username);
// //     var sql='select * from profiles';
// //     db.query(sql,(err,profile)=>{
      
// //      if(err) throw err;
// //      if(profile.length>0){
// //          res.json(profile);
// //      }else{
// //          res.json({Error:"Profile not found"});
// //      }
// //     });
// //  });

// //  //@type   GET
// // //@route  /api/profile/find/everyone
// // //@desc   route for getting user profile using username
// // //@access  PRIVATE


// // router.delete('/',passport.authenticate("jwt",{session:false}),(req,res)=>{

// //     var id=req.user[0].id;
// //     var sql = "DELETE FROM profiless WHERE address =?";
// //   db.query(sql,[id], function (err, result) {
// //     if (err) throw err;
// //     console.log("Number of records deleted from PROFILES: " + result.affectedRows);
// //   });

// //   var sql1 = "DELETE FROM person WHERE address =?";
// //   db.query(sql1,[id], function (err, result) {
// //     if (err) throw err;
// //     console.log("Number of records deleted FROM PERSON: " + result.affectedRows);
// //   });
// // });

module.exports=router;