const handleSignout = (req,res) => {
    const { authorization } = req.headers;
    const token = authorization && authorization.split(' ')[1];
    return token && res.json({success:true}); 
}

module.exports = {
    handleSignout
}