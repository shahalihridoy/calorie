const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  // create a transporter
  const transporter = nodemailer.createTransport({
    // service: "Gmail",
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
      //   in Gmail activate "less secure app" option
    },
  });

  // define email options
  const mailOptions = {
    from: "Md Shah Ali <shahalihridoy@gmail.com>",
    to: options.email,
    subject: options.subject,
    text: options.text,
  };

  // send email with node mailer
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
