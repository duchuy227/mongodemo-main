var express = require('express');
const session = require('express-session');
const { ObjectId } = require('mongodb')
const mongo = require('mongodb');
var app = express()


app.set('view engine', 'hbs')
app.use(express.urlencoded({extended:true}))

app.get('/',(req,res)=>{
    res.render('home')
})
app.get('/create',(req,res)=>{
    res.render('create')
})


app.post('/editProduct',async(req,res)=>{
    let id = req.body._id
    let name = req.body.txtName 
    let discription = req.body.txtDiscription
    let price = req.body.txtPrice 
    let picURL = req.body.txtPicture
    let client = await MongoClient.connect(url);
    let dbo = client.db("ATNToys");
    await dbo.collection("product").updateOne({_id: ObjectId(id)}, 
    {
        $set :{
            'name': name, 
            'discription': discription, 
            'price': price, 
            'picURL': picURL
        }
    })
    res.redirect('/viewAll')
    console.log(id)
})

app.get('/edit',async(req,res)=>{
    let id = req.query.id
    let client = await MongoClient.connect(url);
    let dbo = client.db("ATNToys");
    let product = await dbo.collection("product").findOne({_id: ObjectId(id)});
    console.log(product)
    res.render('edit', {'product': product})
})
app.get('/delete',async(req,res)=>{
    let id = req.query.id; 
    const client = await MongoClient.connect(url);
    let dbo = client.db("ATNToys");
    let collection = dbo.collection('product')  
    let product = await collection.deleteOne({'_id' : ObjectId(id)});
    res.redirect('/viewAll')
})
//duong dan den thu vien mongodb
var url = 'mongodb+srv://chucntq:quynhchuc02@cluster0.dd2uydl.mongodb.net/test';
var MongoClient = require('mongodb').MongoClient;

app.post('/search', async (req,res) =>{
    let nameSearch = req.body.txtName 
    let client = await MongoClient.connect(url);
    let dbo = client.db("ATNToys");
    let products = await dbo.collection("product").
    find({ $or:[{'name': new RegExp(nameSearch,'i')}]}).toArray();
    res.render('allProduct',{'products':products})
})


app.get('/viewAll',async(req,res)=>{
    //1. ket noi den database
    let client = await MongoClient.connect(url);
    let dbo = client.db("ATNToys");
    let products = await dbo.collection("product").find().toArray()
    res.render('allProduct',{'products':products})
})

app.post('/createProduct', async (req,res)=>{
    let name = req.body.txtName 
    let discription = req.body.txtDiscription
    let price = req.body.txtPrice 
    let picURL = req.body.txtPicture
    let product = {
        'name':name,
        'discription': discription,
        'price':price,
        'picURL':picURL

    }
    if (name.length <= 4) {
        res.render('create', { 'nameError': 'Name field must be more than 3 characters' })
        return
    }
    if (discription.length <= 6) {
        res.render('create', { 'DesError': 'Description field must be more than 5 characters' })
        return
    }
    
    //insert product vao data
    //1.ket noi den database server voi dia
    let client = await MongoClient.connect(url);
    let dbo = client.db("ATNToys");
    await dbo.collection("product").insertOne(product);
    res.redirect("/viewAll")


})

app.post('/ascending', async(req,res)=>{
    let price = req.body.txtPrice 

    let server = await MongoClient.connect(url)

    let dbo = server.db("ATNToys")

    let products = await dbo.collection('product').find({'name': new RegExp(price,'i')}).sort({'price':1}).toArray()

    res.render('allProduct',{'products':products})
})

app.post('/decrease', async(req,res)=>{
    let price = req.body.txtPrice 

    let server = await MongoClient.connect(url)

    let dbo = server.db("ATNToys")

    let products = await dbo.collection('product').find({'name': new RegExp(price,'i')}).sort({'price':-1}).toArray()

    res.render('allProduct',{'products':products})
})

const POST = process.env.POST || 8000
app.listen(POST)
console.log("Server is running!")