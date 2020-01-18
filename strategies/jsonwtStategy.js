var JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
 var db=require('../setup/db');
 var key=require('../setup/myurl');


 var cookieExtractor = function(req) {
  var token = null;
  console.log(req.cookies.token);
  console.log("End of////");
  //console.log(req);
  if (req && req.cookies) {
      token = req.cookies['jwt'];
  }
  console.log("token is:"+token);
  return token;
};
// ...
 var opts = {};
 opts.jwtFromRequest = cookieExtractor;
 opts.secretOrKey = key.secret;
module.exports = passport => {
    passport.use(
      new JwtStrategy(opts, (jwt_payload, done) => {
        console.log('Strategy IN')
        console.log(jwt_payload.id);
          var sql='SELECT * FROM person WHERE id=4';
          db.query(sql,(err,user)=>{
             console.log("User:"+user);
             console.log("User id:"+user.name)
            if(err) throw err;

            if(user.length>0){
                return done(null,user);
            }
            else{
                return done(null,false);
            }
          });
      })
    );
  };