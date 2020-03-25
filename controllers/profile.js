const handleProfileGet = (req,res,db) =>  { //can be put,delete and other requests acc. to the user to make changes in their profile
    const {id} = req.params;
    db.select('*').from('users').where({
        id:id
    }).then(response => {
        if(response.length>0)
        res.json(response[0])
        else
        res.json('Not found')
    }).catch(err => res.json(err));
}

module.exports = {
    handleProfileGet
}