import Redis from 'ioredis';
import { Metadata } from 'next';
import { SitemapItem } from '@/shared/types';
import { SITE } from './site';

type SeoParams = {
    title: string;
    description: string;
    url: string;
    image?: string;
    noindex?: boolean;
    favicon?: string;
    fbAppId?: string;
    twitterSite?: string;
    twitterCreator?: string;
};

export function buildSeoMetadata({
    title,
    description,
    url,
    image,
    noindex = false,
    favicon,
    fbAppId,
    twitterSite,
    twitterCreator,
}: SeoParams): Metadata {
    return {
        title: `${title} | ${SITE.name}`,

        description,

        icons: favicon ? { icon: favicon } : undefined,

        alternates: {
            canonical: url,
        },

        robots: {
            index: !noindex,
            follow: !noindex,
        },

        openGraph: {
            type: 'website',
            title: title ?? undefined,
            description,
            url,
            images: image ? [{ url: image }] : [],
            ...(fbAppId ? { appId: fbAppId } : {}),
        },

        twitter: {
            card: 'summary_large_image',
            title: title ?? undefined,
            description,
            images: image ? [image] : [],
            ...(twitterSite ? { site: twitterSite } : {}),
            ...(twitterCreator ? { creator: twitterCreator } : {}),
        },

        metadataBase: new URL(url),
    };
}

export function generateSitemapXml(items: SitemapItem[]): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${items
        .map(
            (item) => `
      <url>
        <loc>${'https://savesmoney.net'}${item.loc}</loc>
        ${item.lastmod ? `<lastmod>${item.lastmod}</lastmod>` : ''}
        ${item.changefreq ? `<changefreq>${item.changefreq}</changefreq>` : ''}
        ${item.priority !== undefined ? `<priority>${item.priority}</priority>` : ''}
      </url>`,
        )
        .join('')}
  </urlset>`;
}

export function mapSocialLinks(socialLinks?: Record<string, string>) {
    if (!socialLinks) return [];

    return Object.values(socialLinks).filter((url): url is string => Boolean(url && url.trim()));
}

type SchemaOptions = {
    siteUrl: string;
    siteName: string;
    description: string;
    logoUrl: string;
    socialLinks?: string[];
    contactEmail?: string;
    breadcrumbs?: {
        name: string;
        url: string;
    }[];
    itemLists?: {
        id: string;
        name: string;
        items?: any[];
    }[];
};

export function createBaseSchema(options: SchemaOptions) {
    const {
        siteUrl,
        siteName,
        description,
        logoUrl,
        socialLinks = [],
        contactEmail,
        breadcrumbs = [],
        itemLists = [],
    } = options;

    return {
        '@context': 'https://schema.org',
        '@graph': [
            // Website
            {
                '@type': 'WebSite',
                '@id': `${siteUrl}/#website`,
                url: `${siteUrl}/`,
                name: siteName,
                description,
                publisher: {
                    '@id': `${siteUrl}/#organization`,
                },
                potentialAction: {
                    '@type': 'SearchAction',
                    target: `${siteUrl}/search?q={search_term_string}`,
                    'query-input': 'required name=search_term_string',
                },
            },

            // Organization
            {
                '@type': 'Organization',
                '@id': `${siteUrl}/#organization`,
                name: siteName,
                url: `${siteUrl}/`,
                logo: {
                    '@type': 'ImageObject',
                    url: siteUrl + logoUrl,
                },
                ...(socialLinks.length && { sameAs: socialLinks }),
                ...(contactEmail && {
                    contactPoint: {
                        '@type': 'ContactPoint',
                        contactType: 'customer support',
                        email: contactEmail,
                        availableLanguage: ['English'],
                    },
                }),
            },

            // Breadcrumb
            breadcrumbs.length
                ? {
                      '@type': 'BreadcrumbList',
                      '@id': `${siteUrl}/#breadcrumb`,
                      itemListElement: breadcrumbs.map((b, index) => ({
                          '@type': 'ListItem',
                          position: index + 1,
                          name: b.name,
                          item: b.url,
                      })),
                  }
                : null,

            // ItemLists
            ...itemLists.map((list) => ({
                '@type': 'ItemList',
                '@id': `${siteUrl}/#${list.id}`,
                name: list.name,
                itemListOrder: 'Descending',
                itemListElement: list.items || [],
            })),
        ].filter(Boolean),
    };
}

export type ContactSchemaOptions = Omit<SchemaOptions, 'contactEmail' | 'breadcrumbs' | 'itemLists'> & {
    contactEmail: string;
};

export function createContactSchema({
    siteUrl,
    siteName,
    description,
    logoUrl,
    contactEmail,
    socialLinks = [],
}: ContactSchemaOptions) {
    return {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'ContactPage',
                '@id': `${siteUrl}/contact#webpage`,
                url: `${siteUrl}/contact`,
                name: `Contact ${siteName}`,
                description,
                isPartOf: {
                    '@id': `${siteUrl}/#website`,
                },
            },
            {
                '@type': 'Organization',
                '@id': `${siteUrl}/#organization`,
                name: siteName,
                url: siteUrl,
                logo: {
                    '@type': 'ImageObject',
                    url: logoUrl,
                },
                contactPoint: {
                    '@type': 'ContactPoint',
                    contactType: 'customer support',
                    email: contactEmail,
                    availableLanguage: ['English'],
                },
                ...(socialLinks.length && { sameAs: socialLinks }),
            },
        ],
    };
}

export type DealAlertSchemaOptions = Pick<SchemaOptions, 'siteUrl' | 'siteName' | 'description'>;

export function createDealAlertSchema({ siteUrl, siteName, description }: DealAlertSchemaOptions) {
    return {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'WebPage',
                '@id': `${siteUrl}/deal-alert#webpage`,
                url: `${siteUrl}/deal-alert`,
                name: 'Deal Alerts',
                description,
                isPartOf: {
                    '@id': `${siteUrl}/#website`,
                },
            },
            {
                '@type': 'Service',
                '@id': `${siteUrl}/#deal-alert-service`,
                name: 'Deal Alert Service',
                description: 'Get notified when new deals, discounts, or coupons are available.',
                provider: {
                    '@id': `${siteUrl}/#organization`,
                },
                areaServed: 'Worldwide',
                availableChannel: {
                    '@type': 'ServiceChannel',
                    serviceLocation: {
                        '@type': 'VirtualLocation',
                    },
                },
            },
        ],
    };
}

export type DealItem = {
    id: string;
    name: string;
    url: string;
    image: string;
    price: number;
    originalPrice?: number;
    currency?: string;
    availability?: 'InStock' | 'OutOfStock';
    seller?: string;
    discountPercent?: number;
};

export type DealTypeSchemaOptions = SchemaOptions & {
    dealType: string; // Expiring Soon | Clearance | Coupon | Holiday Deals...
    deals: DealItem[];
};

export function createDealTypeSchema(options: DealTypeSchemaOptions) {
    const {
        siteUrl,
        siteName,
        description,
        logoUrl,
        socialLinks = [],
        contactEmail,
        breadcrumbs = [],
        dealType,
        deals,
    } = options;

    return {
        '@context': 'https://schema.org',
        '@graph': [
            ...createBaseSchema({
                siteUrl,
                siteName,
                description,
                logoUrl,
                socialLinks,
                contactEmail,
                breadcrumbs,
            })['@graph'],

            // Deal type page (CollectionPage)
            {
                '@type': 'CollectionPage',
                '@id': `${siteUrl}/deal-type/${dealType.toLowerCase().replace(/\s+/g, '-')}#page`,
                name: `${dealType} Deals`,
                description,
                url: `${siteUrl}/deal-type/${dealType.toLowerCase().replace(/\s+/g, '-')}`,
                isPartOf: {
                    '@id': `${siteUrl}/#website`,
                },
                mainEntity: {
                    '@type': 'ItemList',
                    name: `${dealType} Deals`,
                    itemListOrder: 'Descending',
                    numberOfItems: deals.length,
                    itemListElement: deals.map((deal, index) => ({
                        '@type': 'ListItem',
                        position: index + 1,
                        url: deal.url,
                        item: {
                            '@type': 'Product',
                            '@id': `${deal.url}#product`,
                            name: deal.name,
                            image: deal.image,
                            url: deal.url,
                            offers: {
                                '@type': 'Offer',
                                priceCurrency: deal.currency || 'USD',
                                price: deal.price,
                                availability: `https://schema.org/${deal.availability || 'InStock'}`,
                                url: deal.url,
                                ...(deal.originalPrice && {
                                    priceSpecification: {
                                        '@type': 'PriceSpecification',
                                        price: deal.originalPrice,
                                        priceCurrency: deal.currency || 'USD',
                                    },
                                }),
                                ...(deal.seller && {
                                    seller: {
                                        '@type': 'Organization',
                                        name: deal.seller,
                                    },
                                }),
                            },
                        },
                    })),
                },
            },
        ],
    };
}

export type DealDetailSchemaOptions = {
    siteUrl: string;
    siteName: string;

    deal: {
        _id: string;
        name: string;
        description: string;
        slug: string;
        image?: string;

        price: number;
        originalPrice?: number;
        currency: string;

        validUntil?: string;
        purchaseLink: string;

        storeName: string;
    };

    breadcrumbs?: {
        name: string;
        url: string;
    }[];
};

export function createDealDetailSchema(options: DealDetailSchemaOptions) {
    const { siteUrl, deal, breadcrumbs = [] } = options;

    return {
        '@context': 'https://schema.org',
        '@graph': [
            // WebPage
            {
                '@type': 'WebPage',
                '@id': `${siteUrl}/deals/deal-detail/${deal.slug}-${deal._id}#webpage`,
                url: `${siteUrl}/deals/deal-detail/${deal.slug}-${deal._id}`,
                name: deal.name,
                description: deal.description,
            },

            // Breadcrumb
            breadcrumbs.length
                ? {
                      '@type': 'BreadcrumbList',
                      '@id': `${siteUrl}/deals/deal-detail/${deal.slug}-${deal._id}#breadcrumb`,
                      itemListElement: breadcrumbs.map((b, index) => ({
                          '@type': 'ListItem',
                          position: index + 1,
                          name: b.name,
                          item: b.url,
                      })),
                  }
                : null,

            // Product
            {
                '@type': 'Product',
                '@id': `${siteUrl}/deals/deal-detail/${deal.slug}-${deal._id}#product`,
                name: deal.name,
                description: deal.description,
                ...(deal.image && { image: [deal.image] }),

                offers: {
                    '@type': 'Offer',
                    url: deal.purchaseLink,
                    priceCurrency: deal.currency,
                    price: deal.price,
                    availability: 'https://schema.org/InStock',
                    ...(deal.validUntil && {
                        priceValidUntil: deal.validUntil,
                    }),

                    seller: {
                        '@type': 'Organization',
                        name: deal.storeName,
                    },
                },
            },
        ].filter(Boolean),
    };
}

export async function getOrSet<T>(redis: Redis, key: string, fn: () => Promise<T>, ttl = 3600): Promise<T> {
    const cached = await redis.get(key);

    if (cached) {
        return Buffer.from(cached, 'base64') as T;
    }

    const value = await fn();

    if (value instanceof Buffer) {
        await redis.set(key, value.toString('base64'), 'EX', ttl);
    } else {
        await redis.set(key, JSON.stringify(value), 'EX', ttl);
    }

    return value;
}

export interface SitemapEntry {
    loc: string;
    lastmod?: string;
}

export function pushJson(sitemapJson: SitemapEntry[], url: string, lastmod?: any) {
    let iso: string | undefined;

    if (lastmod) {
        if (lastmod instanceof Date) {
            iso = lastmod.toISOString();
        } else if (typeof lastmod === 'string' || typeof lastmod === 'number') {
            const date = new Date(lastmod);
            if (!isNaN(date.getTime())) {
                iso = date.toISOString();
            }
        }
    }

    sitemapJson.push({
        loc: `${url}`,
        lastmod: iso,
    });
}
