const nodemailer = require('nodemailer');
require("dns").setDefaultResultOrder("ipv4first");

async function main() {
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: "santa.treutel95@ethereal.email",
      pass: "PVU8bwQxeXxnxqWqmt",
    },
  });

  let info = await transporter.sendMail({
    from: "santa.treutel95@ethereal.email",
    to: "a.afbre747@gmail.com",
    subject: "Test Ethereal ✔",
    text: "Hello from Nodemailer",
  });

  console.log("Message sent: %s", info.messageId);
}

main().catch(console.error);
