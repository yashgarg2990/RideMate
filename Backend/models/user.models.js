const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// Define a Mongoose schema for a User
const userSchema = new mongoose.Schema({

    // Fullname as a nested object
    fullname: {
        firstname: {
            type: String,
            required: true,
            minlength: [3, 'First name must be 3 characters long']
        },
        lastname: {
            type: String,
            minlength: [3, 'Last name must be 3 characters long']
        }
    },

    // User's email
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: [5, "Email must be at least 5 characters"]
    },

    // Password is required but not returned by default in queries for security
    password: {
        type: String,
        required: true,
        select: false  // 🔒 Prevents password from being returned in queries unless explicitly selected
    },

    // Optional socket ID for real-time connection
    socketId: {
        type: String
    }
});
userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET_KEY ,   { expiresIn: "24h" }  )
    return token  
}

// create a method to compare password  
userSchema.methods.comparePassword = async  function(password) { 
    return await bcrypt.compare(password, this.password)

}
// stattic method to be called upon full model not a particualr instance 
userSchema.statics.hashPassword = async function (password) {
    return await bcrypt.hash(password, 10);
}

const userModel = mongoose.model('user', userSchema);


module.exports = userModel;
