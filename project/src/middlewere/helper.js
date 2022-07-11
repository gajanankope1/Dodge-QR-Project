var nodemailer = require('nodemailer');
function helper(email, link) {
    const transporter = nodemailer.createTransport({
        host:"mail.prometteur.in",
        port:587,
        secure: false,
        auth: {
            user: "no_reply@prometteur.in",
            pass: "!lRb!6]Uv(Ao",
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    var mailOptions = {
        from: 'no_reply@prometteur.in',
        to: email,
        subject: 'Sending Email using Node.js[nodemailer]',
        text:link
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error.message);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
    return;
}

module.exports = helper;