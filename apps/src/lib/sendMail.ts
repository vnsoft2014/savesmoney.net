import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

type SendMailParams = {
    to: string;
    subject: string;
    html: string;
    bcc?: string | string[];
};

export async function sendMail({ to, subject, html, bcc }: SendMailParams) {
    const mailOptions: any = {
        from: process.env.SMTP_FROM,
        to,
        subject,
        html,
    };

    if (bcc) {
        mailOptions.bcc = bcc;
    }

    await transporter.sendMail(mailOptions);
}
