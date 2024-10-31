
import nodemailer from 'nodemailer';

import { SMTP } from '../constants/index.js';
import { env } from '../utils/env.js';

const transporter = nodemailer.createTransport({
    host: env(SMTP.SMTP_HOST),
    port:env(SMTP.SMTP_PORT),
    auth: {
        user:env(SMTP.SMTP_USER),
        pass:env(SMTP.SMTP_PASSWORD),
    },
});

export async function sendEmail (options){
    return await transporter.sendMail(options);
}

