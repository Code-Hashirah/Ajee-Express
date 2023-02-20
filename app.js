const htttp =require('http');
const fs=require('fs');
const bodyParser=require('body-parser');
const express=require('express');
const app=express();
app.use(bodyParser.urlencoded({extended:true}));
const path=require('path');
const adminRoute=require('./routes/admin');
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.use(adminRoute);
app.listen(3002);