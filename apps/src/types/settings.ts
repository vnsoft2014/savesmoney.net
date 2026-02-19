export type SettingsForm = {
    websiteTitle: string;
    websiteDescription: string;
    logo: string;
    favicon: string;
    holidayDealsLabel: string;
    seasonalDealsLabel: string;
    adminEmail: string;
    footerQuote?: string;
    footerQuoteAuthor?: string;
    socialLinks: {
        facebookPage: string;
        facebookGroup: string;
        x: string;
        instagram: string;
        linkedin: string;
    };
};
