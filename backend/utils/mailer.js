// utils/mailer.js
const { Resend } = require("resend");
require("dotenv").config();

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendEmail(to, subject, html) {
    console.log("Resend API key:", process.env.RESEND_API_KEY);

  try {
    const data = await resend.emails.send({
      from: "onboarding@resend.dev",  // change this to your verified sender email
      to: [to],
      subject,
      html,
    });
    console.log("✅ Email sent", data);
  } catch (error) {
    console.error("❌ Email sending error:", error);
  }
}

module.exports = { sendEmail };
