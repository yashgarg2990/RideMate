// Import the user model from the models directory
const userModel = require('../models/user.models');

// Export an async function to create a new user
module.exports.createUser = async ({
    firstname, // User's first name
    lastname,  // User's last name
    email,     // User's email address
    password   // User's password
}) => {
    // Check if required fields are present
    if (!firstname || !email || !password) {
        // Throw an error if any required field is missing
        throw new Error('All fields are required');
    }
    // Create a new user in the database
    const user = userModel.create({
        fullname: {
            firstname, // Assign first name
            lastname   // Assign last name
        },
        email,      // Assign email
        password    // Assign password
    })

    // Return the created user object
    return user;
}