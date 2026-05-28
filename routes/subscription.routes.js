import { Router } from "express";
import authorize from "../middlewares/auth.middleware.js";
import {
  createSubscription,
  getUserSubscriptions,
  getAllSubscriptions,
  getSubscription,
  updateSubscription,
  deleteSubscription,
  cancelSubscription,
  getUpcomingRenewals,
} from "../controllers/subscription.controller.js";

const subscriptionRouter = Router();

/**
 * @swagger
 * /api/v1/subscriptions:
 *   get:
 *     summary: Get all subscriptions
 *     tags: [Subscriptions]
 *     responses:
 *       200:
 *         description: List of all subscriptions
 */
subscriptionRouter.get("/", getAllSubscriptions);

/**
 * @swagger
 * /api/v1/subscriptions/{id}:
 *   get:
 *     summary: Get subscription by ID
 *     tags: [Subscriptions]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Subscription ID
 *     responses:
 *       200:
 *         description: Subscription details
 *       404:
 *         description: Subscription not found
 */
subscriptionRouter.get("/:id", getSubscription);

/**
 * @swagger
 * /api/v1/subscriptions:
 *   post:
 *     summary: Create a new subscription
 *     tags: [Subscriptions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, cost, renewalDate]
 *             properties:
 *               name:
 *                 type: string
 *               cost:
 *                 type: number
 *               renewalDate:
 *                 type: string
 *                 format: date
 *               category:
 *                 type: string
 *     responses:
 *       201:
 *         description: Subscription created
 *       401:
 *         description: Unauthorized
 *       400:
 *         description: Invalid input
 */
subscriptionRouter.post("/", authorize, createSubscription);

/**
 * @swagger
 * /api/v1/subscriptions/{id}:
 *   put:
 *     summary: Update subscription
 *     tags: [Subscriptions]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               cost:
 *                 type: number
 *               renewalDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Subscription updated
 *       404:
 *         description: Subscription not found
 */
subscriptionRouter.put("/:id", updateSubscription);

/**
 * @swagger
 * /api/v1/subscriptions/{id}:
 *   delete:
 *     summary: Delete subscription
 *     tags: [Subscriptions]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Subscription deleted
 *       404:
 *         description: Subscription not found
 */
subscriptionRouter.delete("/:id", deleteSubscription);

/**
 * @swagger
 * /api/v1/subscriptions/user/{id}:
 *   get:
 *     summary: Get user's subscriptions
 *     tags: [Subscriptions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: User subscriptions
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
subscriptionRouter.get("/user/:id", authorize, getUserSubscriptions);

/**
 * @swagger
 * /api/v1/subscriptions/{id}/cancel:
 *   get:
 *     summary: Cancel subscription
 *     tags: [Subscriptions]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Subscription ID
 *     responses:
 *       200:
 *         description: Subscription cancelled
 *       404:
 *         description: Subscription not found
 */
subscriptionRouter.get("/:id/cancel", cancelSubscription);

/**
 * @swagger
 * /api/v1/subscriptions/upcoming-renewals:
 *   get:
 *     summary: Get upcoming subscription renewals
 *     tags: [Subscriptions]
 *     responses:
 *       200:
 *         description: List of upcoming renewals
 */
subscriptionRouter.get("/upcoming-renewals", getUpcomingRenewals);

export default subscriptionRouter;
