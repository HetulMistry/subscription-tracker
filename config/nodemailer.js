import nodemailer from "nodemailer";
import {
  EMAIL_PASSWORD,
  BREVO_LOGIN,
  BREVO_SMTP_KEY,
  ACCOUNT_EMAIL,
} from "./env.js";

export const accountEmail = ACCOUNT_EMAIL;

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  auth: {
    user: BREVO_LOGIN,
    pass: BREVO_SMTP_KEY,
  },
});

export default transporter;
