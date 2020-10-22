const jwt = require('jsonwebtoken');
const redis = require("redis");
const redisClient = redis.createClient(process.env.REDIS_URI);

const handleSignin=(req,db,bcrypt) =>  {                   
    const {email,password} = req.body;
    if(!email || !password)
    return Promise.reject('Wrong Credentials!')
    
    return db.select('email','hash').from('login')
    .where('email','=',email)
    .then(response => {
        const isValid = bcrypt.compareSync(password,response[0].hash);
        if(isValid)
        {
            return db.select('*').from('users')
            .where('email','=',email)
            .then(user => user[0])
            .catch(err => Promise.reject('can\'t get user'));
        }
        else{
            return Promise.reject('Wrong Credentials!');
        }
    })
    .catch(err => {
        console.log(err);
        return Promise.reject('Wrong Credentials')
    })
}

const signToken = (email) => {
    const jwtPayload = { email };
    return jwt.sign(jwtPayload, 'JWT_SECRET', { expiresIn:'2d' });
}

const setToken = (token,id) => {
    return new Promise((resolve,reject) => {
        if(redisClient.set(token,id) && redisClient.expire(token,2*24*60*60))
            return resolve("token stored")
        else 
            return reject("Failed to store")
    })
}

const createSession = (data) => {
    const { email,id } = data;
    const token = signToken(email);
    return setToken(token,id)
          .then(() => ({ success:true, userId:id, token }))
          .catch((err) => err);
}

const getAuthTokenId = (req,res) => {
    const { authorization } = req.headers;
    const token = authorization.split(' ')[1];
    return redisClient.get(token, (err,reply) => {
        if(err || !reply)
          return res.status(400).json('Unauthorized') 
          console.log(reply)
        return res.json({ success:true, userId:reply, token})
    })
}

const signinAuthentication = (req,res,db,bcrypt) => {
    const { authorization } = req.headers;
    const token = authorization && authorization.split(' ')[1];
    return token ?
           getAuthTokenId(req,res)
           : 
           handleSignin(req,db,bcrypt)
          .then(user => {
              return user.id && user.email ? createSession(user) : Promise.reject(user);
           })
          .then(data => res.json(data)) 
          .catch(err => res.status(400).json(err))
}

module.exports = {
    handleSignin,
    signinAuthentication,
    redisClient,
    createSession
}


 