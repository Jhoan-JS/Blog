const nodemailer = require('nodemailer');
const catchAsync = require('./catchAsync');

const sendEmail = catchAsync(async (options) => {
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = await transport.sendMail({
    from: 'Jhoan Miguel Marte Ramirez <jhoanmiguel06@gmail.com', // sender address
    to: options.email, // list of receivers
    subject: options.subject, // Subject line
    text: options.message, // plain text body
    // html: "<b>Hello world?</b>", // html body
  });

  await transport.sendMail(mailOptions);
});

module.exports = sendEmail;
