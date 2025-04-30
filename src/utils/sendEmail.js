import nodemailer from 'nodemailer';
import { getEnvVar } from './getEnvVar.js';

const pass = getEnvVar('SMTP_PASSWORD');
const host = getEnvVar('SMTP_HOST');
const port = getEnvVar('SMTP_PORT');
const user = getEnvVar('SMTP_USER');

const nodemailerConfig = {
  host,
  port,
  secure: true,
  auth: {
    user,
    pass,
  },
};

const transporter = nodemailer.createTransport(nodemailerConfig);

export const sendEmail = (data) => {
  return transporter.sendMail(data);
};
