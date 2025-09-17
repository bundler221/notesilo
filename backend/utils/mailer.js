// utils/mailer.js
const nodemailer = require("nodemailer");
require("dotenv").config();

let transporter;

if (process.env.NODE_ENV === "development") {
  // 🔹 Ethereal for testing (no real email sent)
  nodemailer.createTestAccount().then((testAccount) => {
    transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    console.log("✅ Ethereal test account ready:", testAccount.user);
  });
} else {
  // 🔹 Gmail for real emails (requires App Password!)
  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_USER, // e.g. your Gmail
      pass: process.env.SMTP_PASS, // App Password from Google
    },
  });
}

async function sendEmail(to, subject, html) {
  try {
    const info = await transporter.sendMail({
      from: `"Notesilo" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });

    console.log("✅ Email sent:", info.messageId);

    // Preview URL only works with Ethereal
    if (process.env.NODE_ENV === "development") {
      console.log("🔗 Preview URL:", nodemailer.getTestMessageUrl(info));
    }
  } catch (error) {
    console.error("❌ Email sending error:", error);
    throw error;
  }
}

module.exports = { sendEmail };
