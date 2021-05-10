var ImageKit = require("imagekit");
//CONFIGURATION FOR PROFILE IMAGE UPLOAD API
var imagekit = new ImageKit({
    publicKey : process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey : process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint : `https://ik.imagekit.io/${process.env.IMAGEKIT_ID}/`
});

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
         return trx('login')
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

 const uploadProfileImg = (base64Img,id,mime,res,db) => {
    return imagekit.upload({
        file : base64Img,
        fileName : `${id}.${mime}`,
        folder:'/smart-brain-profiles/'
     },(error, result) => {
         console.log(error,result)
        if(error) {
            console.log(error)
          return res.status(400).json(error);
        }
        else{
             return db('users')
            .where({id})
            .update({
                fileid:result.fileId,
                profileurl:result.url
            }).then(data => {
                console.log(data)
                return res.status(200).json({url:result.url});
            }).catch(err =>{
                console.log('nooo',err)
                 return res.status(400).json(err)
            });
        }
        })
 }

 const handleProfileImgUpload = (req,res,db) => {
     const { id } = req.params;
     
     var base64Img = req.body.profileUrl;
     var mime = base64Img.substring("data:image/".length, base64Img.indexOf(";base64"))
         db.select('fileid').from('users').where({id})
         .then(users => {
             console.log(users[0].fileid)
             if(users[0].fileid){
                return imagekit.deleteFile(users[0].fileid, (error, result) => {
                    if(error)
                        return res.status(400).json(error);
                    else
                        return uploadProfileImg(base64Img,id,mime,res,db);       
                })
              } else
                return uploadProfileImg(base64Img,id,mime,res,db);
            }).catch(err => res.status(400).json(err))
 }

 const handleProfileImgDelete = (req,res,db) => {
     console.log(req.body)
     const { id } = req.params;
         db.select('fileid')
         .from('users')
         .where({id})
         .then(data => {
             console.log(data);
             return imagekit.deleteFile(data[0].fileid, (error, result) => {
                if(error) {
                    console.log(error)
                    return res.status(400).json({success:false})
                }
                else {
                    return db('users')
                    .where({id})
                    .update({
                        fileid:"",
                        profileurl:""
                    }).then(data => {
                        res.status(200).json({success:true})
                    }).catch(err => res.status(400).json(err))
                }
            });
         })
    }

module.exports = {
    handleProfileUpdate,
    handleProfileDelete,
    handleProfileGet,
    handleProfileImgUpload,
    handleProfileImgDelete,
}