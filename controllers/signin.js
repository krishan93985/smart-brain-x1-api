const handleSignin=(req,res,db,bcrypt) =>  {                   
    const {email,password} = req.body;
    if(!email || !password)
    return res.json('Unable to sign in!')
    db.select('email','hash').from('login')
    .where('email','=',email)
    .then(response => {
        const isValid = bcrypt.compareSync(password,response[0].hash);
        if(isValid)
        {
            db.select('*').from('users')
            .where('email','=',email)
            .then(user => {
                res.json(user[0]);
            }).catch(err => res.json('can\'t get user'));
        }
        else{
            res.json('Wrong email or password!');
        }
    })
    .catch(err => res.status(400).json('Wrong email or password!'))
}

module.exports = {
    handleSignin:handleSignin
}


 