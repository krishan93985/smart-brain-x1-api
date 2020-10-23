const jwt = require('jsonwebtoken');
// const redis = require("redis");
// const redisClient = redis.createClient(process.env.REDIS_URI);

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

const signToken = (id,email) => {
    const jwtPayload = { id, email };
    return jwt.sign(jwtPayload, `${process.env.JWT_SECRET}`, { expiresIn:'2d' });
}

const createSession = (data) => {
    const { email,id } = data;
    const token = signToken(id,email);
    return ({ success:true, userId:id, token });
}

const getAuthTokenId = (req,res) => {
    const { authorization } = req.headers;
    const token = authorization.split(' ')[1];
    return jwt.verify(token, `${process.env.JWT_SECRET}`,(err,jwtPayload) => {
        if(err) return res.status(401).json('Unauthorized')
        return res.json({ success:true, userId:jwtPayload.id, token}); 
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
    createSession
}


 