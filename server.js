const express=require('express');
const bodyparser=require('body-parser');
const port=process.env.PORT||1337;
const app=express();
var multer=require('multer');
var upload = multer({ dest: './public/images/portfolio' });

var path=require('path');
var exphbs = require('express-handlebars');
var url=require('url');

const { check, validationResult } = require('express-validator');

const passport=require('passport');
var cookieParser=require('cookie-parser');
var flash = require('connect-flash');


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
app.use('/',auth);
app.use('/:username',profile);
app.use('/api/questions',questions);
app.use('/api/admin',admin);
app.use('/api/index',index);

//Config for JWT strategy
require("./strategies/jsonwtStategy")(passport); 
//passport middleware
app.use(passport.initialize());
app.use(passport.session());


app.use(cookieParser());

// Public Folder
app.use(express.static(path.join(__dirname, 'public')));
//All paths should be written from public like:"images/man_smonke.jpg"

// View Engine
app.set('views', path.join(__dirname, 'views'));//same for views
var hbs = exphbs.create({
    // Specify helpers which are only registered on this instance.
    defaultLayout: 'main',
    partialsDir:'views/partials',
    helpers: {
        list: function (value) { 
             if(value){
            let out="<div>";
            for(var i=0;i< value.length;i++){
            out=out+'<p class="w3-wide">'+value[i].name+'</p>'+
            '<div class="w3-white">'+
          '<div class="w3-dark-grey" style="height:28px;width:'+value[i].value+'%"'+'></div>'+
          '</div>'
            };

          return out +'</div>';
        }
                },
        photos: function (value) { 
            if(value){
           var n=value.length;
           var out1=out2='<div class="w3-half">';
           if(n&1){
            for(var i=0;i<n/2-0.5;i++){
                out1=out1+'<img src="/images/portfolio/'+ value[i]+'"'+' style="width:100%"></img>';
            }
            out1+='</div>';
            for(var i=n/2-0.5;i<n;i++){
                out2=out2+'<img src="/images/portfolio/'+ value[i]+'"'+' style="width:100%"></img>';
            }
            out2+='</div>';
           }else{
            for(var i=0;i<n/2;i++){
                out1=out1+'<img src="/images/portfolio/'+ value[i]+'"'+' style="width:100%"></img>';
            }
            out1+='</div>';
            for(var i=n/2;i<n;i++){
                out2=out2+'<img src="/images/portfolio/'+ value[i]+'"'+' style="width:100%"></img>';
            }
            out2+='</div>';
           }//end of else
          return out1+out2;
        }
        },
        
        links:(arr)=>{
            if(arr){
            var arr_obj=
     {'youtube.com':"fa fa-instagram",
      'facebook.com':'fa fa-facebook-official',
      'snapchat.com':'fa fa-snapchat',
      'pinterest.com':'fa fa-pinterest',
      'twitter.com':'fa fa-twitter',
      'linkdin.com':'fa fa-linkedin'};
             var out="";
            for(var i=0;i<arr.length;i++){
                var adr=arr[i];
                var q = url.parse(adr, true);
                out+= '<a href="'+adr+'"'+'><i class="'+arr_obj[q.host]+' w3-hover-opacity"></i></a>';
               };

               return out;
            }
        },
    }//helpers
});
app.engine('handlebars', hbs.engine);
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

app.listen(port,()=>console.log(`Server is running at port :${port}`));
