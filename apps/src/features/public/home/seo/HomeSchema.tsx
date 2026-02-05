'use client';

import SchemaOrg from '@/shared/seo/SchemaOrg';
import { RootState } from '@/store/store';
import { SettingsForm } from '@/types/settings';
import { createBaseSchema, mapSocialLinks } from '@/utils/seo';
import { SITE } from '@/utils/site';
import { useSelector } from 'react-redux';

export default function HomeSchema() {
    const settings = useSelector((state: RootState) => state.frontendNav.settings) as SettingsForm;

    const socialLinks = mapSocialLinks(settings?.socialLinks);

    const homeSchema = createBaseSchema({
        siteUrl: SITE.url || 'https://savesmoney.net',
        siteName: settings?.websiteTitle || SITE.title,
        description: settings?.websiteDescription || SITE.description,
        logoUrl: settings?.logo || `${SITE.url}/logo.png`,
        socialLinks,
        contactEmail: settings?.adminEmail,
        breadcrumbs: [
            {
                name: 'Home',
                url: `${SITE.url || 'https://savesmoney.net'}/`,
            },
        ],
        itemLists: [
            {
                id: 'just-for-you-deals',
                name: 'Just For You Deals',
            },
            {
                id: 'expiring-soon-deals',
                name: 'Expiring Soon Deals',
            },
            {
                id: 'frontpage-deals',
                name: 'Frontpage Deals on SavesMoney',
            },
        ],
    });

    return <SchemaOrg schema={homeSchema} id="home-schema" />;
}
