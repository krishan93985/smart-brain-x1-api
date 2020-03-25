const express = require('express');
const cors = require('cors');
const knex = require('knex');
const bcrypt = require('bcrypt-nodejs');
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const image = require('./controllers/image');
const profile = require('./controllers/profile');
app = express();

const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'postgres',
      password : 'learn',
      database : 'smartbrain'
    }
  });

app.use(cors());
app.use(express.json());

app.get('/',(req,res) => {
    res.send('its working!');
    })

app.post('/register',(req,res) => register.handleRegister(req,res,db,bcrypt));
//OR app.post('/register',register.handleRegister(db,bcrypt)); currying
// if called as const handleRegister = (db,bcrypt) => (req,res) => {..}

app.post('/signin',(req,res) => signin.handleSignin(req,res,db,bcrypt));

app.get('/profile/:id',(req,res) => profile.handleProfileGet(req,res,db));

app.post('/imageurl',(req,res) =>image.handleApiCall(req,res));

app.put('/image',(req,res) =>image.handleImage(req,res,db));

app.listen(process.env.PORT || 3000,()=> console.log(`App is running at post ${process.env.PORT}`));






//'/' GET :its working
// '/signin' POST:success/failure
//'/register' POST:
// '/profile/:id' GET/PUT/DELETE/POST
// '/image' PUT


