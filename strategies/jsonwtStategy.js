var JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
var db=require('../setup/db');
var key=require('../setup/myurl')
var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = key.secret;
/* Extractjwt.fromAuthHeaderAsBeareToen=== Kuch asa ha:
Extract-jwt:function (request) {

        var token = null;
        if (request.headers[AUTH_HEADER]) {
            var auth_params = auth_hdr.parse(request.headers[AUTH_HEADER]);
            if (auth_params && auth_scheme_lower === auth_params.scheme.toLowerCase()) {
                token = auth_params.value;
            }
        }
        return token;
    }


*/ 
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