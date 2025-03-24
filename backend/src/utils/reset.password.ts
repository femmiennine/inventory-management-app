import nodemailer from 'nodemailer';
import { dev } from '../config/dev';

export const sendResetPasswordEmail = async (name: string, email: string) => {
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
      subject: 'Reset Account Password Link',
      html: `<p>Hi ${name}! Kindly click the link below to reset your password</p> <b/> 
            <a href="http://localhost:3000/reset-password"> Please reset your password </a>`,
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
