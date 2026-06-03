import Subscription from "../models/subscription.model.js";
import { sendReminderEmail } from "../utils/send-email.js";
import { verifyTransporter } from "../config/nodemailer.js";

export const sendTestReminder = async (req, res, next) => {
  try {
    const { subscriptionId } = req.body;
    if (!subscriptionId)
      return res
        .status(400)
        .json({ success: false, message: "subscriptionId is required" });

    const subscription = await Subscription.findById(subscriptionId).populate(
      "user",
      "name email",
    );
    if (!subscription)
      return res
        .status(404)
        .json({ success: false, message: "subscription not found" });
    if (subscription.status !== "active")
      return res
        .status(400)
        .json({ success: false, message: "subscription not active" });

    // Reuse existing sendReminderEmail utility (uses templates)
    // Diagnostic: verify transporter first and log env info
    try {
      await verifyTransporter();
      console.log("verifyTransporter: success (attempting send)");
    } catch (vErr) {
      console.error(
        "verifyTransporter failed (continuing to send):",
        vErr && vErr.message,
      );
    }

    await sendReminderEmail({
      to: subscription.user.email,
      type: "1 days before reminder",
      subscription,
    });

    return res.json({ success: true, message: "Test email sent" });
  } catch (err) {
    console.error("sendTestReminder error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
};
