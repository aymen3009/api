const mongoose = require('mongoose');

const Userschema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique:true,
        lowercase: true
    },
    cin: {
        type: String,
        required: true,

    },
    password: {
        type: String,
        required: true,

    },
    profileURL:{
        type: String,
        required : false
    
    },
    studentid:{
        type: String,
        required: false
    },
    verified:{
        type: Boolean,
        default : false
    }

})


module.exports = mongoose.model('Users', Userschema);

