const express = require('express');
require('dotenv').config();
const cors = require('cors');
const nodemailer = require("nodemailer");
const mg = require('nodemailer-mailgun-transport');

const app = express();
const port = process.env.PORT || 5000;

// middlewares
app.use(express.json());
app.use(cors());

const auth = {
    auth: {
        api_key: process.env.EMAIL_PRIVATE_KEY,
        domain: process.env.EMAIL_DOMAIN
    }
}

const transporter = nodemailer.createTransport(mg(auth));

// const transporter = nodemailer.createTransport({
//     host: "smtp.forwardemail.net",
//     port: 465,
//     secure: true,
//     auth: {
//         // TODO: replace `user` and `pass` values from <https://forwardemail.net>
//         user: "REPLACE-WITH-YOUR-ALIAS@YOURDOMAIN.COM",
//         pass: "REPLACE-WITH-YOUR-GENERATED-PASSWORD",
//     },
// });

const sendEmail = async (details) => {
    const { email, subject, message } = details;
    const info = await transporter.sendMail({
        from: email, // sender address
        to: "spartha343@gmail.com", // list of receivers
        subject: subject, // Subject line
        text: `This is an email from your portfolio ${message}`, // plain text body
        html: `
            <div>
            <p>${message}</p>
            </div>
        `, // html body
    });
    return info;
}

const run = async () => {
    try {
        app.post('/send-email', async (req, res) => {
            const details = req.body;
            const info = await sendEmail(details);
            const { message, status } = info;
            res.send({ message, status });
        })
    }
    finally {

    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send("Hello from developer's portfolio server");
})

app.listen(port, () => {
    console.log(`developer's portfolio server is running perfectly on port: ${port}`);
})