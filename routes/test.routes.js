import { Router } from "express";
import authorize from "../middlewares/auth.middleware.js";
import { sendTestReminder } from "../controllers/test.controller.js";

const router = Router();

/**
 * POST /api/v1/test/send-reminder-email
 * Protected route - requires Bearer token
 * body: { subscriptionId: string }
 */
/**
 * @swagger
 * /api/v1/test/send-reminder-email:
 *   post:
 *     summary: Send a single reminder email immediately for testing (authenticated)
 *     tags: [Test]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               subscriptionId:
 *                 type: string
 *                 description: MongoDB ObjectId of the subscription
 *     responses:
 *       200:
 *         description: Test email sent
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
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Subscription not found
 *       500:
 *         description: Server error
 */
router.post("/send-reminder-email", authorize, sendTestReminder);

export default router;
