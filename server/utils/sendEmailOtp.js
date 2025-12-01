const nodemailer = require("nodemailer");

const sendEmailOtp = async(to, otp) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail", // ✅ Yeh sahi hai
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject: "OTP Verification for Signup",
            html: `
        <div style="font-family: Arial, sans-serif; padding: 10px;">
          <h2>🔐 Your OTP Code: <span style="color: blue;">${otp}</span></h2>
          <p>Please enter this OTP to verify your email and complete your signup.</p>
          <p>If you didn’t request this, you can ignore this email.</p>
          <br/>
          <strong>Thanks,<br/>Food Ordering Team</strong>
        </div>
      `,
        };

        await transporter.sendMail(mailOptions);
        console.log(`📧 OTP sent to ${to}`);
    } catch (error) {
        console.error("❌ Email send error:", error);
        throw error;
    }
};

module.exports = sendEmailOtp;