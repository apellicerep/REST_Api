const express = require('express')
const auth = require('basic-auth')
const User = require('./models').User
const bcryptjs = require('bcryptjs');



const authenticateUser = async (req, res, next) => {
    let message = null;
    let currentUser = {};
    let user;

    // Get the user's credentials from the Authorization header.
    const credentials = auth(req);


    // Look for a user whose `username` matches the credentials `name` property.
    user = await User.findOne({
        where: { emailAddress: credentials.name }
    })


    if (credentials) {

        if (user) {
            const { id, emailAddress, firstName, password } = user.toJSON()
            const authenticated = bcryptjs
                .compareSync(credentials.pass, password);
            if (authenticated) {
                console.log(`Authentication successful for username: ${firstName}`);
                console.log(user.id)
                currentUser.id = id;
                currentUser.emailAddress = emailAddress
                currentUser.firstName = firstName

                // Store the user on the Request object.
                req.currentUser = currentUser; //nos servira para saber quien hace el request.
            } else {
                message = `Authentication failure for username: ${firstName}`;
            }
        } else {
            message = `User not found with email: ${credentials.name}`;
        }
    } else {
        message = 'Auth header not found';
    }

    if (message) {
        console.warn(message);
        res.status(401).json({ message: 'Access Denied' });
    } else {
        next();
    }

};

module.exports = { authenticateUser }