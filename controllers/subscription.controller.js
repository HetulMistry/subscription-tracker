import Subscription from "../models/subscription.model.js";
import { workflowClient } from "../config/upstash.js";
import { SERVER_URL } from "../config/env.js";

export const createSubscription = async (req, res, next) => {
    try {
        const subscription = await Subscription.create({
            ...req.body,
            user: req.user._id
        });

        console.log("✅ Subscription created:", subscription._id);
        console.log("📅 Renewal date:", subscription.renewalDate);
        console.log("🔗 SERVER_URL:", SERVER_URL);

        const { workflowRunId } = await workflowClient.trigger({
            url: `${SERVER_URL}/api/v1/workflows/subscription/reminder`,
            body: {
                subscriptionId: subscription.id,
            },
            headers: {
                'content-type': 'application/json',
            },
            retries: 0,
        });

        console.log("🚀 Workflow triggered with runId:", workflowRunId);

        res.status(201).json({
            success: true,
            data: { subscription, workflowRunId }
        });
    } catch (error) {
        console.error("❌ Error:", error.message);
        next(error);
    }
};

export const getUserSubscriptions = async (req, res, next) => {
    try {
        if (req.user.id !== req.params.id) {
            const error = new Error("You are not the owner of this account");
            error.statusCode = 401;
            throw error;
        }

        const subscriptions = await Subscription.find({ user: req.params.id });

        res.status(200).json({
            success: true,
            data: subscriptions
        });
    } catch (error) {
        next(error);
    }
};