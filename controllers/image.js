const Clarifai = require('clarifai');

const handleImage = (req,res,db) =>  {
    const {id} = req.body;
    db('users').where({
        id:id
    }).increment('entries',1)
    .returning('entries')
    .then(response => {
        if(response.length) 
        res.json(response[0]);
        else
        res.json('Not found');
    }).catch(err => res.json(err));
}

const handleApiCall = (req,res) => {
    const app = new Clarifai.App({
        apiKey: `${process.env.API_KEY}`
       })
    app.models.predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
    .then(response => {
        console.log(response)
        return res.json(response);
    }).catch(err => res.status(400).json(err));
}

module.exports = {
    handleImage,
    handleApiCall
}