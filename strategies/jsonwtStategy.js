var JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
var db=require('../setup/db');
var key=require('../setup/myurl')
var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = key.secret;

module.exports = passport => {
    passport.use(
      new JwtStrategy(opts, (jwt_payload, done) => {
          var sql="select id from person where id=?";
          db.query(sql,jwt_payload.id,(err,result)=>{
             
            if(err) throw err;

            if(result.length>0){
                return done(null,result);
            }
            else{
                return done(null,false);
            }
          });
        // Person.findById(jwt_payload.id)
        //   .then(person => {
        //     if (person) {
        //       return done(null, person);
        //     }
        //     return done(null, false);
        //   })
        //   .catch(err => console.log(err));
      })
    );
  };