const nodemailer = require("nodemailer");

exports.sendOtpEmail = async (to, otp) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.hostinger.com", // ✅ Use your domain's mail server
    port: 587,                // Use 465 if SSL, 587 if TLS
    secure: false,            // true for 465, false for 587
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD, // update this in .env
    },
  });

  await transporter.sendMail({
    from: `"NyPay Team" <${process.env.SMTP_EMAIL}>`,
    to,
    subject: "Your OTP Code",
    html: `
      <div style="font-family:sans-serif;">
        <h3>OTP Verification</h3>
        <p>Your OTP is <strong>${otp}</strong>. It will expire in 10 minutes.</p>
        <p>Thank you,<br>NyPay Team</p>
      </div>
    `,
  });

  // console.log("✅ OTP email sent to:", to);
};
