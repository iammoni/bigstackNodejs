const express=require('express');
const bodyparser=require('body-parser');
const port=process.env.PORT||1337;
const app=express();

app.listen(port,()=>console.log(`Server is running at port :${port}`));
