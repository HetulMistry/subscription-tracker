import nodemailer from "nodemailer";
import { EMAIL_PASSWORD } from "./env.js";

export const accountEmail = "xdlol0568@gmail.com";

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: "xdlol0568@gmail.com",
        pass: EMAIL_PASSWORD
    }
});

export default transporter;