import connectDB from '@/DB/connectDB';
import Settings from '@/models/Settings';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    await connectDB();

    const { affiliateStores } = await req.json();

    const settings = await Settings.findOneAndUpdate({}, { affiliateStores }, { new: true, upsert: true });

    return NextResponse.json(settings);
}

export async function GET() {
    try {
        await connectDB();

        let settings = await Settings.findOne();

        if (!settings) {
            settings = await Settings.create({
                websiteTitle: 'My Website',
                websiteDescription: 'Description',
                adminEmail: 'admin@example.com',
                affiliateStores: [],
            });
        }

        return NextResponse.json({
            affiliateStores: settings.affiliateStores || [],
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to fetch affiliate settings' }, { status: 500 });
    }
}
