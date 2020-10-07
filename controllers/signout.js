const { redisClient } = require('./signin');

const revokeAuthToken = (token) => {
    return new Promise((resolve,reject) => {
        if(redisClient.del(token))
            return resolve({success:true});
        else
            return reject({success:false});
    })
}

const handleSignout = (req,res) => {
    const { authorization } = req.headers;
    const token = authorization && authorization.split(' ')[1];
    return token &&
           revokeAuthToken(token)
           .then(data => res.json(data))
           .catch(err => res.status(400).json(err)); 
}

module.exports = {
    handleSignout
}