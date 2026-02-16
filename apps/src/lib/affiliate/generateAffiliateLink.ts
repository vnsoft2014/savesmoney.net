import { AffiliateStore, getAffiliateStores } from './getAffiliateStores';

export async function generateAffiliateLink(originalUrl: string) {
    try {
        const stores: AffiliateStore[] = await getAffiliateStores();

        const url = new URL(originalUrl);
        const hostname = url.hostname.toLowerCase();

        const store = stores.find((s) => hostname.includes(s.slug));

        if (!store || !store.enabled) {
            return originalUrl;
        }

        switch (store.slug) {
            case 'amazon':
                url.searchParams.set('tag', store.affiliateId);
                return url.toString();

            case 'ebay':
                url.searchParams.set('campid', store.affiliateId);
                return url.toString();

            case 'walmart':
            case 'target':
            case 'nike':
            case 'adidas':
            case 'homedepot':
            case 'samsclub':
                return `https://impact.com/c/${store.affiliateId}?u=${encodeURIComponent(originalUrl)}`;

            case 'macys':
            case 'ulta':
            case 'kohls':
            case 'lululemon':
            case 'michaelkors':
            case 'marcjacobs':
            case 'versace':
            case 'underarmour':
                return `https://rakuten.com/r/${store.affiliateId}?url=${encodeURIComponent(originalUrl)}`;

            case 'costco':
            case 'cvs':
            case 'walgreens':
            case 'victoriassecret':
                return `https://www.anrdoezrs.net/click-${store.affiliateId}?url=${encodeURIComponent(originalUrl)}`;

            default:
                return originalUrl;
        }
    } catch {
        return originalUrl;
    }
}
