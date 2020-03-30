const handleProfileGet = (req,res,db) => {
    const {id} = req.params;
    db.select('*').from('users')
    .where('id','=',id)
    .then(user => {
        if(user[0].id)
        res.json(user[0]);
        else
        res.status(400).json('Unable to get Profile!');
    }).catch(err => res.status(400).json('Unable to get Profile!'))
}

const handleProfileUpdate = (req,res,db,bcrypt) =>  { //can be put,delete and other requests acc. to the user to make changes in their profile
    const name=req.body.name,password=req.body.password,email=req.body.email;
    if(!name || !email || !password)
    return res.status(400).json('Unable to Update Profile!')
    const {id} = req.params;
    const hash = bcrypt.hashSync(password);
      db.transaction(trx => {  
            trx('login').where('id','=',id)
            .update({
                email:email,
                hash:hash
            },'id')
            .then(userId => {
             return trx('users').where('id','=',userId[0])
                .update({
                    name:name,
                    email:email
                })
                .returning('*')
                .then(user => {
                    res.json(user[0]);
                }).catch(err => res.status(400).json('Unable to Update Profile!'))
            }).then(trx.commit)
            .catch(trx.rollback)
        })
    }

 const handleProfileDelete = (req,res,db) => {
     const { id } = req.params;
     db.transaction(trx => {
         trx('login')
         .where('id','=',id)
         .del()
         .then(response => { //del() returns the parameter i.e id and resolves promise
             return trx('users')
             .where('id','=',id).del() //don't use response as an id as it will not delete data from the upcoming table
             .then(response => {
                res.json('success')
             }).catch(err => res.status(400).json('Unable to delete profile!'))
         }).then(trx.commit)
         .catch(trx.rollback)
     })
 }
    
module.exports = {
    handleProfileUpdate,
    handleProfileDelete,
    handleProfileGet
}