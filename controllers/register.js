const { createSession } = require('./signin');

const handleRegister=(req,db,bcrypt) => {
    const {name,email,password,profileUrl} = req.body;
    if(!name || !email || !password)
    return Promise.reject('Unable to register!!')
    
    const hash = bcrypt.hashSync(password);
    return db.transaction(trx => {
        return trx.insert({ hash, email })
        .into('login')
        .returning('email')
        .then(loginEmail => {
            return trx('users')
            .insert({
             name:name,
             email:loginEmail[0],
             joined:new Date()
          })
        .returning('*')
        .then(user => Promise.resolve(user[0]));
        }).then(trx.commit)
        .catch(trx.rollback);
        })
        .catch(err => Promise.reject('Unable to register!'));
}

const generateAuthToken = (req,res,db,bcrypt) => {
    handleRegister(req,db,bcrypt)
    .then(user => {
        return user.email && user.id ? createSession(user) : Promise.reject('Unable to register!!!');
    })
    .then(data => res.json(data))
    .catch(err => { console.log(err);  return res.status(400).json(err)})
}

module.exports = {
    generateAuthToken
}