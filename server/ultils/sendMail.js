import nodemailer from 'nodemailer';
import asyncHandler from 'express-async-handler';
const sendMail = asyncHandler(async ({ email, html }) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: process.env.EMAIL_NAME,
      pass: process.env.EMAIL_APP_PASS,
    },
  });

  // async..await is not allowed in global scope, must use a wrapper
  async function main() {
    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: '"Cuahangdientu" <no-reply@cuahangdientu.com>', // sender address
      to: email, // list of receivers
      subject: 'Forgot Password', // Subject line
      text: 'Hello world?', // plain text body
      html: html, // html body
    });

    return info;
  }

  main().catch(console.error);
});

export default sendMail;
