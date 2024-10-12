const express = require('express');

const app = express()

app.use(express.json());

app.get('/',(req,res)=>{
    res.send("Hello world")
});

app.get('/ramya',(req,res)=>{
    res.send("this is ramya")
});

app.post('/bavya',(req,res)=>{
    res.send("this is bhavya")
});

app.post('/data',(req,res)=>{
    const info = req.body;
    console.log(info);
    res.send("true");
});

app.listen(5000, ()=>{
    console.log('server is running..')
});


