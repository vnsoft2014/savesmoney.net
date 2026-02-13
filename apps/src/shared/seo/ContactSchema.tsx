import { RootState } from '@/store/store';
import { SettingsForm } from '@/types/settings';
import { createContactSchema, mapSocialLinks } from '@/utils/seo';
import { SITE } from '@/utils/site';
import { useSelector } from 'react-redux';
import SchemaOrg from './SchemaOrg';

export default function ContactSchema() {
    const settings = useSelector((state: RootState) => state.frontendNav.settings) as SettingsForm;

    const socialLinks = mapSocialLinks(settings?.socialLinks);

    const contactSchema = createContactSchema({
        siteUrl: SITE.url || 'https://savesmoney.net',
        siteName: settings?.websiteTitle || SITE.title,
        description: settings?.websiteDescription || 'Contact SavesMoney customer support',
        logoUrl: settings?.logo || `${SITE.url}/logo.png`,
        contactEmail: settings?.adminEmail,
        socialLinks,
    });

    return <SchemaOrg schema={contactSchema} id="contact-schema" />;
}
