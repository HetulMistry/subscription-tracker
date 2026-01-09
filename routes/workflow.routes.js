import { Router } from "express";
import { sendReminders } from "../controllers/workflow.controller.js";
import { sendReminderEmail } from "../utils/send-email.js";
import Subscription from "../models/subscription.model.js";

const workflowRouter = Router();

workflowRouter.post("/subscription/reminder", sendReminders);

export default workflowRouter;