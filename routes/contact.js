var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
var smtpConfig = {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // use SSL
    auth: {
        user: 'ctp315.16@gmail.com',
        pass: 'password315'
    }
};

var transporter = nodemailer.createTransport(smtpConfig);

router.post('/', function(req, res){
    var data = req.body;

    var mailOptions = {
        to: "ctp315.16@gmail.com",
        subject: "Email from: " + data.contactName + " " + data.contactEmail,
        text: data.contactMsg
    };
    console.log(JSON.stringify(mailOptions));
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            console.log(error.message);

        }
        else{
            console.log("message sent: " + info.response);
        }
        return res.json({
            message: "success"
        });
    });
});
module.exports = router;
