import StatsCards from '@/features/public/my-store/overview/StatsCard';
import { getActiveDeals } from '@/services';
import { DealFull } from '@/shared/types';
import Link from 'next/link';

const Page = async () => {
    //const { user } = useAuth();

    const [dealListResponse] = await Promise.all([
        getActiveDeals('', '', 1, {
            author: '696a53f51165b2a3036b895f',
            source: 'user',
        }),
    ]);

    const dealList = dealListResponse.data as DealFull[];

    return (
        <div className="container mx-auto py-10 px-4 md:px-8 space-y-8 bg-slate-50/50 min-h-screen">
            {/* Stats */}
            <StatsCards
                stats={{
                    totalDeals: 20,
                    totalLikes: 100,
                    totalPurchaseClicks: 12,
                    totalViews: 200,
                    hotDeals: 10,
                }}
            />

            {/* Header + Add Button */}
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Deal Management</h2>
                <Link
                    href="/my-store/deal/add"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow"
                    prefetch={false}
                >
                    + Add Deal
                </Link>
            </div>

            {/* Deals Table */}
            <div className="bg-white rounded-xl shadow overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-100 text-left">
                        <tr>
                            <th className="p-4">Product</th>
                            <th className="p-4">Category</th>
                            <th className="p-4">Discount</th>
                            <th className="p-4">Price</th>
                            <th className="p-4">Sold</th>
                            <th className="p-4">Time Left</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dealList.map((deal) => (
                            <tr key={deal._id} className="border-t hover:bg-gray-50">
                                <td className="p-4 flex items-center gap-3">
                                    <img
                                        src={deal.image}
                                        alt={deal.shortDescription}
                                        className="w-12 h-12 object-cover rounded"
                                    />
                                    <span className="font-medium">{deal.shortDescription}</span>
                                </td>
                                <td className="p-4">
                                    {deal.dealType?.map((type: any) => type.name).join(', ') || '-'}
                                </td>
                                <td className="p-4 text-red-500 font-semibold">-{deal.discountPrice}%</td>
                                <td className="p-4">
                                    <div className="font-semibold">{deal.discountPrice}</div>
                                    <div className="line-through text-gray-400 text-xs">{deal.originalPrice}</div>
                                </td>
                                <td className="p-4"></td>
                                <td className="p-4"></td>
                                <td className="p-4"></td>
                                <td className="p-4 text-right space-x-2">
                                    <Link
                                        href={`/my-store/deal/${deal._id}`}
                                        prefetch={false}
                                        className="text-blue-600 hover:underline"
                                    >
                                        Edit
                                    </Link>
                                    <button className="text-red-600 hover:underline">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Page;
