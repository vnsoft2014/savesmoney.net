import mongoose from 'mongoose';

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

    socialLinks: {
        facebookPage: { type: String, trim: true, default: '' },
        facebookGroup: { type: String, trim: true, default: '' },
        x: { type: String, trim: true, default: '' }, // X = Twitter
        instagram: { type: String, trim: true, default: '' },
        linkedin: { type: String, trim: true, default: '' },
    },
});

const Settings = mongoose.models.Settings || mongoose.model('Settings', SettingsSchema);

export default Settings;
