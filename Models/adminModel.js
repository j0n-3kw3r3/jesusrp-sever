const mongoose = require('mongoose');


const Admin = mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
           
        },
        password: {
            type: String,
            required: true,
        },
    

    }
    
);
Admin.index({ username: 1 }, { unique: true });

module.exports = mongoose.model("Admin", Admin);
