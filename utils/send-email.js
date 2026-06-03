import dayjs from "dayjs";
import { emailTemplates } from "./email-template.js";
import transporter, {
  accountEmail,
  verifyTransporter,
} from "../config/nodemailer.js";

export const sendReminderEmail = async ({ to, type, subscription }) => {
  if (!to || !type) throw new Error("Missing required parameters");

  const template = emailTemplates.find((t) => t.label === type);

  if (!template) throw new Error(`Invalid email template type: ${type}`);

  const mailInfo = {
    userName: subscription.user.name,
    subscriptionName: subscription.name,
    renewalDate: dayjs(subscription.renewalDate).format("MMM D, YYYY"),
    planName: subscription.name,
    price: `${subscription.currency} ${subscription.price} (${subscription.frequency})`,
    paymentMethod: subscription.paymentMethod,
  };

  const message = template.generateBody(mailInfo);
  const subject = template.generateSubject(mailInfo);

  const mailOptions = {
    from: accountEmail,
    to: to,
    subject: subject,
    html: message,
  };

  try {
    const start = Date.now();
    // Verify transporter connectivity before sending (diagnostic)
    try {
      await verifyTransporter();
    } catch (verifyErr) {
      console.error(
        "verifyTransporter failed:",
        verifyErr && verifyErr.message ? verifyErr.message : verifyErr,
      );
      // continue to attempt sendMail to capture full error details
    }

    const info = await transporter.sendMail(mailOptions);
    const duration = Date.now() - start;
    console.log(`Email sent: ${info.response} (elapsed ${duration}ms)`);
  } catch (error) {
    console.error("Error sending email:", {
      message: error && error.message,
      code: error && error.code,
      response: error && error.response,
      stack: error && error.stack,
    });
    throw error;
  }
};
