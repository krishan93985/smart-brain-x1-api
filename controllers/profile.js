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

const handleProfileUpdate = (req,res,db) =>  { //can be put,delete and other requests acc. to the user to make changes in their profile
    const { name, age, pet } = req.body.formInput;
    const {id} = req.params;

    if( !name || !id )
    return res.status(400).json('Unable to Update Profile!')

    db('users')
     .where({ id })
     .update({ name, age, pet })
     .then(response => {
         console.log(response);
         if(response){
             res.json('success');
         } else{
             res.status(400).json('Unable to Update Profile!')
         }
     }).catch(err => { res.status(400).json('Unable to Update Profile!') })
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