// const email = require('emailjs');
import email from 'emailjs';
const server 	= email.server.connect({
  user:    "makeup.scheduler@gmail.com",
  password:"1409makeup-scheduler",
  host:    "smtp.gmail.com",
  ssl:     true,
  port: 465
});

const sendEmail = (code,receiver, url, senderEmail, senderName) => {
  server.send({
    text:    "Click the link below to join session or use the join code",
    from:    `${senderName}<${senderEmail}>`,
    to:      receiver,
    subject: `${senderName} has sent you a make up session join code`,
    attachment:
      [
        {data:`<html><a href="${url}">${url}</a></html>`, alternative:true},
      ]
  },(msg) => {
    console.log(msg)
  });
};

// send the message and get a callback with an error or details of the message that was sent
export default sendEmail;
