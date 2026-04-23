import nodemailer from "nodemailer";
import { EMAIL_USER, EMAIL_PASS } from "./env.js";

export const accountEmail = EMAIL_USER;

const transporter = nodemailer.createTransport({
   service: 'gmail',
   auth: {
      user: accountEmail,
      pass: EMAIL_PASS
   }
})

export default transporter;