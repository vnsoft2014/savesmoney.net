import { createDealAlertSchema } from '@/utils/seo';
import SchemaOrg from './SchemaOrg';
import { SITE } from '@/utils/site';

export default function DealAlertSchema() {
    const dealAlertSchema = createDealAlertSchema({
        siteUrl: SITE.url || 'https://savesmoney.net',
        siteName: SITE.title,
        description: 'Sign up to receive instant alerts when new deals, discounts, or coupons are available.',
    });

    return <SchemaOrg schema={dealAlertSchema} id="deal-alert-schema" />;
}
