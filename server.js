//3rd party modules
const express = require('express');
const cors = require('cors');
const knex = require('knex');
const bcrypt = require('bcrypt-nodejs');
const morgan = require('morgan');
const compression = require('compression');
const helmet = require('helmet');

//local modules
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const signout = require('./controllers/signout')
const image = require('./controllers/image');
const profile = require('./controllers/profile');
const auth = require('./controllers/authorization');

//instantiate express
app = express();

//For heroku deployment
const db = knex({
  client: 'pg',
  connection: {
    connectionString : process.env.DATABASE_URL,
    ssl: {
    rejectUnauthorized: false
    }
  }
});

//For local development
// const db = knex({
//   client: 'pg',
//   connection: process.env.POSTGRES_URI
// })
var whitelist = ['http://localhost:3001','http://localhost:3000', 'https://smart-brain-x1.herokuapp.com'];
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

app.use(cors(corsOptions)); //allow whitelisted origins
app.use(morgan('combined'));  //logger
app.use(express.json({limit:'10mb'}));  //set limit for request entity
app.use(compression()); //gzip
app.use(helmet());  //set required headers

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

app.put('/upload_profile_img/:id', auth.requireAuth, (req,res) => profile.handleProfileImgUpload(req,res,db));

app.delete('/delete_profile_img/:id', auth.requireAuth, (req,res) => profile.handleProfileImgDelete(req,res,db));

app.delete('/signout/:id', auth.requireAuth, (req,res) => signout.handleSignout(req,res));

app.delete('/profile/delete/:id', auth.requireAuth, (req,res) => profile.handleProfileDelete(req,res,db))

app.listen(process.env.PORT || 3000,()=> console.log(`App is running at port ${process.env.PORT||3000}`));


