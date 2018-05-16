/**
 * Copyright 2015 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

const functions = require('firebase-functions');
const nodemailer = require('nodemailer');
// Configure the email transport using the default SMTP transport and a GMail account.
// For Gmail, enable these:
// 1. https://www.google.com/settings/security/lesssecureapps
// 2. https://accounts.google.com/DisplayUnlockCaptcha
// For other types of transports such as Sendgrid see https://nodemailer.com/transports/
// TODO: Configure the `gmail.email` and `gmail.password` Google Cloud environment variables.
const gmailEmail = functions.config().gmail.email;
const gmailPassword = functions.config().gmail.password;
const mailTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: gmailEmail,
    pass: gmailPassword,
  },
});

// Your company name to include in the emails
// TODO: Change this to your app or company name to customize the email sent.
const APP_NAME = 'Makeup-Scheduler';
// [START FireEMail]
/*
* Send Email to each email in firestore when new email is added
*/
exports.fireEmail = functions.database.ref("/emailProxy").onUpdate(
  change => {
    // {key: <email>}
    console.log(gmailEmail,gmailPassword);
    const emails = change.after.val();
    Object.keys(emails).map(mId => {
      fireTheEmail(emails[mId]);
    });
    return change.after.ref.remove();
  }

);

const fireTheEmail = (session) => {
  const {owner, name,link, code,mail} = session;
  // console.log("data",owner,link,code,mail);
  const mailOptions = {
    from: `${APP_NAME} <noreply@firebase.com>`,
    to: mail,
  };

  // The user subscribed to the newsletter.
  mailOptions.subject = `${owner} invite to join makeup session`;
  mailOptions.html = `Please use code below to join the makeup session for <b>${name}</b><br/>
                       <h1 style="text-align:center">${code}</h1>
                       <br/>
                       or click this link: <h3 style="text-align:center"><a href="${link}">${link}</a></h3>`;
  return mailTransport.sendMail(mailOptions).then(() => {
    return console.log('Session code sent to:', mail);
  });
}
