var JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
 var db=require('../setup/db');
 var key=require('../setup/myurl');

 var cookieExtractor = function(req) {
  var token = null;
  //console.log(req)
  //console.log("index of token"+req.rawHeaders[req.rawHeaders.indexOf('Cookie')+1]);
  if (req && req.rawHeaders[req.rawHeaders.indexOf('Cookie')+1]) {
      token = req.rawHeaders[req.rawHeaders.indexOf('Cookie')+1].replace('jwt=','');
  //console.log("token:"+token);
  }
  //this will return original token
  
  return token; 
};
// ...
 var opts = {};
 opts.jwtFromRequest = cookieExtractor;
 opts.secretOrKey = key.secret;

module.exports = passport => {
    passport.use(
      new JwtStrategy(opts, (jwt_payload, done) => {
        // console.log('Strategy IN')
        // console.log(jwt_payload.id);
          var sql='SELECT * FROM profiles WHERE id=?';
          db.query(sql,jwt_payload.id,(err,user)=>{

            // console.log("User:"+user[0]);
            // console.log("User id:"+user[0].email);
            
             if(err) throw err;
            
             if(user.length>0){
                return done(null,user);
             }
             else{
                return done(null,false);
             }
          });
      })
    )
    }