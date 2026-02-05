import { MESSAGES } from '@/constants/messages';
import { Schema } from 'joi';
import { NextResponse } from 'next/server';

export async function validateRequest(req: Request, schema: Schema) {
    try {
        let data = {};

        if (req.method === 'GET') {
            const { searchParams } = new URL(req.url);
            data = Object.fromEntries(searchParams.entries());
        } else {
            data = await req.json();
        }

        const { error, value } = schema.validate(data, {
            abortEarly: false,
            stripUnknown: true,
            convert: true,
        });

        if (error) {
            return {
                isValid: false,
                response: NextResponse.json(
                    {
                        success: false,
                        message: MESSAGES.ERROR.VALIDATION,
                        errors: error.details.map((d) => d.message.replace(/['"]+/g, '')),
                    },
                    { status: 400 },
                ),
            };
        }

        return {
            isValid: true,
            value,
            response: NextResponse.json({}),
        };
    } catch (err) {
        return {
            isValid: false,
            response: NextResponse.json({ success: false, message: 'Invalid JSON format' }, { status: 400 }),
        };
    }
}
