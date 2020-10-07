const redisClient = require('./signin').redisClient;

const requireAuth = (req,res,next) => {
    const { authorization } = req.headers;
    const token = authorization && authorization.split(' ')[1];
    if(!token){
        return res.status(401).json('Unauthorized');
    }
    return redisClient.get(token, (err,reply) => {
        if(err || !reply){
            return res.status(401).json('Unauthorized')
        }
        return next();
    })
}

module.exports = {
    requireAuth
}