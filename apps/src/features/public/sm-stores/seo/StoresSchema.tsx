import { UserStore } from '@/shared/types';
import { RootState } from '@/store/store';
import { SettingsForm } from '@/types/settings';
import { createBaseSchema } from '@/utils/seo';
import { SITE } from '@/utils/site';
import { useSelector } from 'react-redux';
import SchemaOrg from '../../../../shared/seo/SchemaOrg';

type Props = {
    stores: UserStore[];
    typeName: string;
    typeSlug: string;
};

export default function StoresSchema({ stores, typeName, typeSlug }: Props) {
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
                id: `${typeSlug}-stores`,
                name: `${typeName} Stores`,
                items: stores.map((store, index) => ({
                    '@type': 'ListItem',
                    position: index + 1,
                    url: `${SITE.url}/sm-stores/${store.slug}-${store._id}`,
                })),
            },
        ],
    });

    return <SchemaOrg schema={schema} id={`stores-${typeSlug}-schema`} />;
}
