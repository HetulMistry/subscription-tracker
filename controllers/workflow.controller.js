import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { serve } = require("@upstash/workflow/express");
import dayjs from "dayjs";
import Subscription from "../models/subscription.model.js";

const REMAINDERS = [7, 5, 2, 1];

export const sendRemainders = serve(async (context) => {
    const { subscriptionId } = context.requestPayload;

    const subscription = await fetchSubscription(context, subscriptionId);

    if (!subscription || subscription.status !== 'active') return;

    const renewalDate = dayjs(subscription.renewalDate);

    if (renewalDate.isBefore(dayjs())) {
        console.log(`Renewal Date has passed for subscription ${subscriptionId}. Stopping workflow.`);
        return;
    }

    for (const daysBefore of REMAINDERS) {
        const remainderDate = renewalDate.subtract(daysBefore, 'day');

        if (remainderDate.isAfter(dayjs()))
            await sleepUntillRemainder(context, `Remainder ${daysBefore} days before`, remainderDate);

        await triggerRemainder(context, `Remainder ${daysBefore} days before`);
    }
});

const fetchSubscription = async (context, subscriptionId) => {
    return await context.run("get subscription", async () => {
        return Subscription.findById(subscriptionId).populate("user", "name email");
    });
};

const sleepUntillRemainder = async (context, label, date) => {
    console.log(`Sleeping untill ${label} remainder at ${date}`);
    await context.sleepUntill(label, date.toDate());
};

const triggerRemainder = async (context, label) => {
    return await context.run(label, () => {
        console.log(`Triggering ${label} remainder`);
        // TODO: Implement email sending logic here
    });
};