import { Router } from "express";
import { sendReminders } from "../controllers/workflow.controller.js";
import { sendReminderEmail } from "../utils/send-email.js";
import Subscription from "../models/subscription.model.js";

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

export default workflowRouter;