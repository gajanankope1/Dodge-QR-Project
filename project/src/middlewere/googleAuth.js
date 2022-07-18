const Users = require('../models/users')

const { OAuth2Client } = require('google-auth-library');
const CLIENT_ID = '868427010265-j10im9mk0h35er7oj4htou7qq6rrk18l.apps.googleusercontent.com'
const client = new OAuth2Client(CLIENT_ID);

async function checkAuthenticated(req, res, next) {
    const users = await Users.find({});
    for (let i = 0; i < users.length; i++) {
        let token = users[i].google_token

        let user = {};
        async function verify() {
            const ticket = await client.verifyIdToken({
                idToken: token,
                audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
            });
            const payload = ticket.getPayload();
            user.name = payload.name;
            user.email = payload.email;
            user.picture = payload.picture;
            user.google_token = token;
        }
        verify()
            .then(() => {
                req.user = user;
                next();
            }).catch(err => {
                console.log(err.message);
            });
    }
}

module.exports = checkAuthenticated;