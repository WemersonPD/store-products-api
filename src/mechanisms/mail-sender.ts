import nodemailer from 'nodemailer';
import { ConstantsEnv } from '../constants';

export default class MailSender {
  static async send(to: string, subject: string, html: string):
    Promise<void> {
    console.log({
      user: ConstantsEnv.mailing.email,
      pass: ConstantsEnv.mailing.password,
    })
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      secureConnection: true,
      auth: {
        user: ConstantsEnv.mailing.email,
        pass: ConstantsEnv.mailing.password,
      },
      tls: {
        rejectUnauthorized: false,
      }
    });

    const mailOptions = {
      from: ConstantsEnv.mailing.email,
      to,
      subject,
      html,
    };

    await transporter.sendMail(mailOptions, null);
  }
}
