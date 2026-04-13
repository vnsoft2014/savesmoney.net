import { SITE } from '@/config/site';
import { createBaseSchema } from '@/lib/seo';
import { RootState } from '@/store/store';
import { DealFull } from '@/types';
import { SettingsForm } from '@/types/settings';
import { useSelector } from 'react-redux';
import SchemaOrg from '../../../../shared/seo/SchemaOrg';

type DealTypeSchemaProps = {
    deals: DealFull[];
    typeName: string; // "Expiring Soon"
    typeSlug: string; // "expiring-soon"
};

export default function DealTypeSchema({ deals, typeName, typeSlug }: DealTypeSchemaProps) {
    const settings = useSelector((state: RootState) => state.frontendNav.settings) as SettingsForm | undefined;

    const schema = createBaseSchema({
        siteUrl: SITE.url || 'https://savesmoney.net',
        siteName: settings?.websiteTitle || SITE.title,
        description: settings?.websiteDescription || SITE.description,
        logoUrl: settings?.logo || `${SITE.url}/logo.png`,
        breadcrumbs: [
            {
                name: 'Home',
                url: SITE.url || 'https://savesmoney.net',
            },
            {
                name: typeName,
                url: `${SITE.url}/${typeSlug}`,
            },
        ],
        itemLists: [
            {
                id: `${typeSlug}-deals`,
                name: `${typeName} Deals`,
                items: deals.map((deal, index) => ({
                    '@type': 'ListItem',
                    position: index + 1,
                    url: `${SITE.url}/deals/deal-detail/${deal.slug}-${deal._id}`,
                })),
            },
        ],
    });

    return <SchemaOrg schema={schema} id={`deal-type-${typeSlug}-schema`} />;
}
