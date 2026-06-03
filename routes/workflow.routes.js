import { Router } from "express";
import { sendReminders } from "../controllers/workflow.controller.js";
import { sendReminderEmail } from "../utils/send-email.js";
import Subscription from "../models/subscription.model.js";

// Helper endpoint for local/manual testing (bypasses QStash signature verification)
// POST /api/v1/workflows/subscription/reminder/test
// body: { subscriptionId: string }
const express = Router; // keep linters happy if Router used above

const testHandler = async (req, res) => {
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

    // Trigger a single immediate reminder email (uses existing utility)
    await sendReminderEmail({
      to: subscription.user.email,
      type: "1 days before reminder",
      subscription,
    });

    return res.json({ success: true, message: "Test email triggered" });
  } catch (err) {
    console.error("Test email error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
};

const workflowRouter = Router();

/**
 * @swagger
 * /api/v1/workflows/subscription/reminder:
 *   post:
 *     summary: Send subscription renewal reminders
 *     tags: [Workflows]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               daysUntilRenewal:
 *                 type: number
 *     responses:
 *       200:
 *         description: Reminders sent successfully
 *       400:
 *         description: Invalid input
 */
workflowRouter.post("/subscription/reminder", sendReminders);
/**
 * @swagger
 * /api/v1/workflows/subscription/reminder/test:
 *   post:
 *     summary: Trigger a single test reminder email for a subscription (bypasses QStash)
 *     tags: [Workflows]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               subscriptionId:
 *                 type: string
 *                 description: MongoDB ObjectId of the subscription to test
 *     responses:
 *       200:
 *         description: Test email triggered
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       400:
 *         description: Bad request (missing or invalid subscriptionId)
 *       404:
 *         description: Subscription not found
 *       500:
 *         description: Server error
 */
workflowRouter.post("/subscription/reminder/test", testHandler);

export default workflowRouter;
