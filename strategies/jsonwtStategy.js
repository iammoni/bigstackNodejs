var JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
var db=require('../setup/db');
var key=require('../setup/myurl')
var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();

console.log("Extract-jwt:"+ExtractJwt.fromAuthHeaderAsBearerToken());
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