'use client';

import SchemaOrg from '@/shared/seo/SchemaOrg';
import { DealFull } from '@/shared/types';
import { RootState } from '@/store/store';
import { SettingsForm } from '@/types/settings';
import { createDealDetailSchema } from '@/utils/seo';
import { SITE } from '@/utils/site';
import { useSelector } from 'react-redux';

export default function DealDetailSchema({ deal }: { deal: DealFull }) {
    const primaryType = deal.dealType?.[0];

    const settings = useSelector((state: RootState) => state.frontendNav.settings) as SettingsForm;

    const schema = createDealDetailSchema({
        siteUrl: SITE.url || 'https://savesmoney.net',
        siteName: settings?.websiteTitle || SITE.title,
        deal: {
            _id: deal._id,
            name: deal.shortDescription,
            description: deal.description,
            slug: deal.slug,
            image: deal.image,

            price: deal.discountPrice,
            originalPrice: deal.originalPrice,
            currency: 'USD',

            validUntil: deal.disableExpireAt ? undefined : deal.expireAt || undefined,

            storeName: deal.store.name,
            purchaseLink: deal.purchaseLink,
        },

        breadcrumbs: [
            { name: 'Home', url: SITE.url || 'https://savesmoney.net' },
            ...(primaryType
                ? [
                      {
                          name: primaryType.name,
                          url: `${SITE.url}/deal-type/${primaryType.slug}`,
                      },
                  ]
                : []),
            {
                name: deal.shortDescription,
                url: `${SITE.url}/deal/${deal.slug}`,
            },
        ],
    });

    return <SchemaOrg schema={schema} id="deal-detail-schema" />;
}
