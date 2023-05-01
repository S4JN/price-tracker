const nodemailer = require("nodemailer");
require('dotenv').config();

async function sendNotification(price, url) {

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    });

    let textToSend = 'Price dropped to ' + price;
    let htmlText = `<a href=\"${url}\">Click on the Link to buy</a>`;

    let info = await transporter.sendMail({
        from: '"Price Tracker" <20bcs060@ietdavv.edu.in>',
        to: "srajanacharya09@gmail.com",
        subject: 'Price droppedto ' + price,
        text: textToSend,
        html: htmlText
    });

    console.log("Message sent: %s", info.messageId);
}

module.exports = { sendNotification }
