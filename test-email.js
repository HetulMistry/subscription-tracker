import transporter, { accountEmail } from "./config/nodemailer.js";

const testEmail = async () => {
  const testMailOptions = {
    // from: accountEmail,
    from: {
      name: "NoReply Hetul Mistry",
      address: accountEmail,
    },
    to: "test@mail.com", // CHANGE THIS TO YOUR EMAIL
    subject: "🧪 SubDub Email Test - Configuration Working!",
    html: `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h1 style="color: #4a90e2;">✅ Email Configuration Test</h1>
                <p>If you're reading this, your email configuration is working correctly!</p>
                <p><strong>Test Details:</strong></p>
                <ul>
                    <li>Sender: ${accountEmail}</li>
                    <li>Service: Brevo SMTP</li>
                    <li>Time: ${new Date().toLocaleString()}</li>
                </ul>
                <p>You can now proceed with sending actual emails from your application.</p>
            </div>
        `,
  };

  try {
    console.log("📧 Sending test email...");
    const info = await transporter.sendMail(testMailOptions);
    console.log("✅ Email sent successfully!");
    console.log("Response:", info.response);
  } catch (error) {
    console.error("❌ Error sending test email:");
    console.error(error.message);
    process.exit(1);
  }
};

testEmail();
