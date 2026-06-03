import nodemailer from "nodemailer";
import {
  EMAIL_PASSWORD,
  BREVO_LOGIN,
  BREVO_SMTP_KEY,
  ACCOUNT_EMAIL,
} from "./env.js";

export const accountEmail = ACCOUNT_EMAIL;

// Nodemailer transporter with diagnostics enabled for Render troubleshooting.
// Keep timeouts reasonably short to fail fast on network issues.
const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: BREVO_LOGIN,
    pass: BREVO_SMTP_KEY,
  },
  logger: true,
  debug: true,
  connectionTimeout: 10000,
  greetingTimeout: 5000,
  socketTimeout: 10000,
  tls: {
    // Allow self-signed certs if needed by the environment; adjust if unnecessary.
    rejectUnauthorized: false,
  },
});

export const verifyTransporter = async () => {
  try {
    const ok = await transporter.verify();
    console.log("transporter.verify: ok=", ok);
    return ok;
  } catch (err) {
    console.error(
      "transporter.verify error:",
      err && err.message ? err.message : err,
    );
    throw err;
  }
};

export default transporter;
