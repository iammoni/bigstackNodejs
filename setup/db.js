//  Start  All about databases

 //mysql Configuartion
 var mysql=require('mysql');

 //configure database
 const dbC=require('./myurl');
 var db = mysql.createConnection({
     host: dbC.host,
     user: dbC.user,
     database:dbC.database,

   });
  //connect database
   db.connect(function(err) {
     if (err) throw err;
     console.log("Connected!");

   });


// Make our db accessible to other module
module.exports=db;


//End of All about Database