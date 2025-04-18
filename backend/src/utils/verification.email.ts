import nodemailer from 'nodemailer';
import { dev } from '../config/dev';

export const sendVerificationEmail = async (
  name: string,
  email: string,
  token: string
) => {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: dev.smtp.auth_email,
        pass: dev.smtp.auth_password,
      },
    });

    const mailOptions = {
      from: dev.smtp.auth_email,
      to: email,
      subject: 'Verification Email',
      html: `<p> Welcome to FoodStock Inventory Management System, ${name}! <a href="http://localhost:5173/verify/${token}"> Click for email verification </a> </p>`,
    };

    await transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Message sent: %s', info.response);
      }
    });
  } catch (error) {
    console.log(error);
  }
};
