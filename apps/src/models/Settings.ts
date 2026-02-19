import mongoose from 'mongoose';

const AffiliateStoreSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        slug: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
        },
        affiliateId: {
            type: String,
            required: true,
            trim: true,
        },
        enabled: {
            type: Boolean,
            default: true,
        },
    },
    { _id: false },
);

const SettingsSchema = new mongoose.Schema({
    websiteTitle: {
        type: String,
        required: true,
        trim: true,
    },

    websiteDescription: {
        type: String,
        required: true,
        trim: true,
    },

    logo: {
        type: String,
        trim: true,
        default: '',
    },

    favicon: {
        type: String,
        trim: true,
        default: '',
    },

    holidayDealsLabel: {
        type: String,
        trim: true,
    },

    seasonalDealsLabel: {
        type: String,
        trim: true,
    },

    adminEmail: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
    },

    footerQuote: {
        type: String,
        trim: true,
    },

    footerQuoteAuthor: {
        type: String,
        trim: true,
    },

    socialLinks: {
        facebookPage: { type: String, trim: true, default: '' },
        facebookGroup: { type: String, trim: true, default: '' },
        x: { type: String, trim: true, default: '' },
        instagram: { type: String, trim: true, default: '' },
        linkedin: { type: String, trim: true, default: '' },
    },

    affiliateStores: {
        type: [AffiliateStoreSchema],
        default: [],
    },
});

const Settings = mongoose.models.Settings || mongoose.model('Settings', SettingsSchema);

export default Settings;
