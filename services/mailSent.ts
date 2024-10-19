import nodemailer, { SendMailOptions } from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { settings } from '../config/settings';

const MailType = {
      OTP: 'OTP.html',
      // WELCOME: 'WELCOME.html',
      PASSWORDCHANGED: 'PASSWORDCHANGED.html',
} as const;

export type MailTemplate = keyof typeof MailType;

export type MailPropsMap = {
      OTP: { otp: string, firstname: string, username: string, password: string };
      WELCOME: { username: string };
      PASSWORDCHANGED: { otp: string, firstname: string };
};

type SendMailProps = {
      to: string;
      mailType: MailTemplate;
} & MailPropsMap[MailTemplate];

const sendMail = async ({ to, mailType, ...props }: SendMailProps) => {
      try {
            const htmlFilePath = path.join(__dirname, 'Templates', MailType[mailType]);
            const htmlContent = fs.readFileSync(htmlFilePath, 'utf8');

            let updatedHtmlContent = Object.entries(props).reduce(
                  (content, [key, value]) => content.replace(new RegExp(`{{${key.toUpperCase()}}}`, 'g'), value), htmlContent
            );

            updatedHtmlContent = updatedHtmlContent.replace(/{{COMPANYNAME}}/g, settings.APPNAME);

            const mailOptions: SendMailOptions = {
                  from: settings.mail.SMTP_USER,
                  to,
                  subject: `${settings.APPNAME}`,
                  html: updatedHtmlContent,
                  date: new Date(),
                  encoding: 'utf8',
                  watchHtml: updatedHtmlContent,
            };

            const transporter = await nodemailer.createTransport({
                  host: 'smtp.gmail.com',
                  port: 587,
                  secure: false,
                  auth: {
                        user: settings.mail.SMTP_USER,
                        pass: settings.mail.SMTP_PASS
                  },
            });

            const info = await transporter.sendMail(mailOptions);

            console.log('Message sent: %s', info);
      } catch (error) {
            console.log(error);
      }
};

export { sendMail };
