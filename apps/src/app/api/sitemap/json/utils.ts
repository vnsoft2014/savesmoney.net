import Deal from '@/models/Deal';
import { UserStore } from '@/models/UserStore';
import pLimit from 'p-limit';

export const createUserStoreSitemapTasks = (totalCount: number, prefix: string) => {
    const pageSize = 200;
    const limit = pLimit(10);

    const totalPages = Math.ceil(totalCount / pageSize);

    return Array.from({ length: totalPages }, (_, i) =>
        limit(async (): Promise<{ loc: string; lastmod?: string }> => {
            const items = await UserStore.find({ isActive: true })
                .sort({ updatedAt: 1 }) // asc
                .skip(pageSize * i)
                .limit(pageSize)
                .select('updatedAt slug')
                .lean();

            return {
                loc: `/sitemap/${prefix}-${i + 1}.xml`,
                lastmod: items.at(-1)?.updatedAt?.toISOString(),
            };
        }),
    );
};

export const createDealSitemapTasks = (totalCount: number, prefix: string) => {
    const pageSize = 200;
    const limit = pLimit(10);

    const totalPages = Math.ceil(totalCount / pageSize);

    return Array.from({ length: totalPages }, (_, i) =>
        limit(async (): Promise<{ loc: string; lastmod?: string }> => {
            const items = await Deal.find()
                .sort({ updatedAt: 1 }) // asc
                .skip(pageSize * i)
                .limit(pageSize)
                .select('updatedAt')
                .lean();

            return {
                loc: `/sitemap/${prefix}-${i + 1}.xml`,
                lastmod: items.at(-1)?.updatedAt?.toISOString(),
            };
        }),
    );
};
