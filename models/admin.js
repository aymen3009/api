const mongoose = require('mongoose');

const Userschema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,

    },
    profileURL:{
        type: String,
        default : "/uploads/logo-isima.png"
        
    
    },


})


module.exports = mongoose.model('Admin', Userschema);

