export type AffiliateStore = {
    slug: string;
    affiliateId: string;
    network?: string;
    enabled: boolean;
};

export async function getAffiliateStores(): Promise<AffiliateStore[]> {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/settings/affiliate`, {
            cache: 'no-store',
        });

        if (!res.ok) return [];

        const data = await res.json();
        return data.affiliateStores || [];
    } catch {
        return [];
    }
}
