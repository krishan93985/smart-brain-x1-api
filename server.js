const express = require('express');
const cors = require('cors');
const knex = require('knex');
const bcrypt = require('bcrypt-nodejs');
const morgan = require('morgan');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const signout = require('./controllers/signout')
const image = require('./controllers/image');
const profile = require('./controllers/profile');
const auth = require('./controllers/authorization');

app = express();
// const db = knex({
//   client: 'pg',
//   connection: {
//     connectionString : process.env.DATABASE_URL,
//     ssl: {
//     rejectUnauthorized: false
//   }
//   }
// });

const db = knex({
  client: 'pg',
  connection: process.env.POSTGRES_URI
})

app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

app.get('/',(req,res) => {
    res.send('its working!');
    })

app.post('/register',(req,res) => register.generateAuthToken(req,res,db,bcrypt));
//OR app.post('/register',register.handleRegister(db,bcrypt)); currying
// if called as const generateAuthToken = (db,bcrypt) => (req,res) => {..}

app.post('/signin',(req,res) => signin.signinAuthentication(req,res,db,bcrypt));

app.get('/profile/:id', auth.requireAuth, (req,res) => profile.handleProfileGet(req,res,db));

app.put('/profile/:id', auth.requireAuth, (req,res) => profile.handleProfileUpdate(req,res,db));

app.post('/imageurl', auth.requireAuth, (req,res) =>image.handleApiCall(req,res));

app.put('/image', auth.requireAuth, (req,res) =>image.handleImage(req,res,db));

app.delete('/signout/:id', auth.requireAuth, (req,res) => signout.handleSignout(req,res));

app.delete('/profile/delete/:id', auth.requireAuth, (req,res) => profile.handleProfileDelete(req,res,db))

app.listen(process.env.PORT || 3000,()=> console.log(`App is running at port ${process.env.PORT||3000}`));




//'/' GET :its working
// '/signin' POST:success/failure
//'/register' POST:
// '/profile/:id' GET/PUT/DELETE/POST
// '/image' PUT


