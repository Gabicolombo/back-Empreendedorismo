const jwt = require('jsonwebtoken');
const User = require('../schemas/user');
const config = require('../config/off.json');

const auth = async(req, res, next) => {
    try{
   
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, config.secret)
        
        const user = await User.findOne({_id: decoded._id, 'tokens.token':token})
        
        if(!user){
            console.error('user here' + user)
            throw new Error()
        }

        req.token = token
        req.user = user
        next()

    }catch(e){
        res.status(401).send(e.message)
        //.json({error:'Por favor você precisa se autenticar'})
    }
}

module.exports = auth;