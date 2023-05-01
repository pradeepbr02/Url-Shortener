const express = require('express');
const bodyparser = require('body-parser');
const ejs = require('ejs');

const mongoose = require('mongoose');
const shortid = require('shortid');
mongoose.connect("mongodb://127.0.0.1:27017/urlShortner" , {useNewUrlParser: true});


const urlSchema = new mongoose.Schema({
    full :{
        type : String ,
        required : true
    }
    ,
    short :{
        type : String, 
        required : true,
        default : shortid.generate
    }
});

const shortUrl =mongoose.model('shortUrl' , urlSchema );
const app = express();

app.set('view engine' , 'ejs');
app.use(bodyparser.json());
app.use(bodyparser.urlencoded(
    {extended : true}
));

app.use(express.static('public'));

app.get('/' , async (req , res)=>{
    const getUrls = await shortUrl.find({});
    res.render('index' , {
        allUrls  : getUrls
    })
})


app.post('/' ,async (req, res)=>{
    let longOne = req.body.longUrl;
    if(longOne=""){
        res.redirect("/")
    }
    await shortUrl.create({full : longOne});
    res.redirect('/');
      
   
})

app.get("/:shortid" , (req , res)=>{
    let shortid= req.params.shortid;

    const shortOne = shortUrl.findOne({short : shortid});
    if(shortOne==null){
        return res.sendStatus(404);
    }
    res.redirect(shortOne.full);
})


app.post('/delete' , async (req , res)=>{
    let collectData = await shortUrl.find({} );
    if(collectData){
       await shortUrl.deleteMany({});
    }
    res.redirect('/')
})

app.listen(5000 , ()=>{
    console.log("Server is running");
})