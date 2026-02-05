import { getDealTypes } from '@/services/admin/deal-type';
import { getSettings } from '@/services/admin/settings';
import { MainNavClient } from './components';
import { headerData } from './data';

const MainNav = async () => {
    const [dealTypes, settings] = await Promise.all([getDealTypes(), getSettings()]);

    const holidayDealsLabel = settings?.holidayDealsLabel || 'Holiday Deals';
    const seasonalDealsLabel = settings?.seasonalDealsLabel || 'Seasonal Deals';

    const dealTypeLinks = dealTypes.map((type: any) => ({
        label: type.name,
        href: `/deals/${type.slug}-${type._id}`,
    }));

    const updatedLinks = headerData.map((item) => {
        if (item.href === '/deals') {
            return {
                ...item,
                links: dealTypeLinks,
            };
        } else if (item.href === '/holiday-deals') {
            return {
                ...item,
                label: holidayDealsLabel,
            };
        } else if (item.href === '/seasonal-deals') {
            return {
                ...item,
                label: seasonalDealsLabel,
            };
        }

        return item;
    });

    return <MainNavClient links={updatedLinks} settings={settings} />;
};

export default MainNav;
