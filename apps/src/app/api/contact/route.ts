import { MESSAGES } from '@/constants/messages';
import Settings from '@/models/Settings';
import { sendMail } from '@/utils/sendMail';
import Joi from 'joi';
import { NextResponse } from 'next/server';

const contactSchema = Joi.object({
    name: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().optional(),
    radio: Joi.string().allow(''),
    message: Joi.string().allow(''),
    checkboxes: Joi.array().items(Joi.string()),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const { error, value } = contactSchema.validate(body, {
            abortEarly: false,
        });

        if (error) {
            return NextResponse.json({ message: MESSAGES.ERROR.VALIDATION }, { status: 400 });
        }

        const settings = await Settings.findOne().lean();

        if (settings.adminEmail) {
            throw new Error();
        }

        await sendMail({
            to: settings.adminEmail,
            subject: 'New Contact Form Submission',
            html: `
        <h2>New Contact Message</h2>
        <p><strong>Name:</strong> ${value.name} ${value.lastName}</p>
        <p><strong>Email:</strong> ${value.email}</p>
        <p><strong>Phone:</strong> ${value.phone || '-'}</p>
        <p><strong>Service:</strong> ${value.radio || '-'}</p>
        <p><strong>Options:</strong> ${(value.checkboxes || []).join(', ')}</p>
        <p><strong>Message:</strong></p>
        <p>${value.message || '-'}</p>
      `,
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ success: false, message: MESSAGES.ERROR.INTERNAL_SERVER }, { status: 500 });
    }
}
