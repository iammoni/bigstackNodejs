const express=require('express');
const bodyparser=require('body-parser');
const port=process.env.PORT||1337;
const app=express();
var multer=require('multer');
var upload = multer({ dest: './public/images/portfolio' });

var path=require('path');
var exphbs = require('express-handlebars');

const { check, validationResult } = require('express-validator');

const passport=require('passport');
var cookieParser=require('cookie-parser');
var flash = require('connect-flash');



//Config for JWT strategy
require("./strategies/jsonwtStategy")(passport); 


//bring all routes
const auth=require('./routes/api/auth');
const profile=require('./routes/api/profile');
const questions=require('./routes/api/questions');
const admin=require('./routes/api/admin');
const index=require('./routes/api/index');
////////////////middlewares///////////////

//middleware for bodyParser .../since we throwing json data & handle post data
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:true}));

//our actual routes make them use
app.use('/api/auth',auth);
app.use('/api/profile',profile);
app.use('/api/questions',questions);
app.use('/api/admin',admin);
app.use('/api/index',index);


//passport middleware
app.use(passport.initialize());

app.use(cookieParser());

// Public Folder
app.use(express.static(path.join(__dirname, 'public')));

// View Engine
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(check());
//app.use(validationResult());

// Connect Flash
app.use(flash());
 ////////end of middlewares///////// 

// Validator
// app.use(expressValidator({
//     errorFormatter: function(param, msg, value) {
//         var namespace = param.split('.')
//         , root    = namespace.shift()
//         , formParam = root;
  
//       while(namespace.length) {
//         formParam += '[' + namespace.shift() + ']';
//       }
//       return {
//         param : formParam,
//         msg   : msg,
//         value : value
//       };
//     }
//   }));

app.get('/',(req,res)=>{
res.json({root:"This is root path"});
});
app.listen(port,()=>console.log(`Server is running at port :${port}`));
