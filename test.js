var url=require('url');
var arr=[ 'https://youtube.com', 'https://facebook.com' ];
/* <i class="fa fa-facebook-official w3-hover-opacity"></i>
    <i class="fa fa-instagram w3-hover-opacity"></i>
    <i class="fa fa-snapchat w3-hover-opacity"></i>
    <i class="fa fa-pinterest-p w3-hover-opacity"></i>
    <i class="fa fa-twitter w3-hover-opacity"></i>
    <i class="fa fa-linkedin w3-hover-opacity"></i> */

var arr_obj=
    {'youtube.com':"fa fa-instagram ",
    'facebook.com':'fa fa-facebook-official',
    'snapchat.com':'fa fa-snapchat',
    'pinterest.com':'fa fa-pinterest',
     'twitter.com':'fa fa-twitter',
      'linkdin.com':'fa fa-linkedin'};
        
   var out="";
for(var i=0;i<arr.length;i++){
    var adr=arr[i];
    var q = url.parse(adr, true);
    console.log(arr_obj[q.host]);
    out+= '<i class="'+fa fa-instagram 'w3-hover-opacity"></i>';
}
