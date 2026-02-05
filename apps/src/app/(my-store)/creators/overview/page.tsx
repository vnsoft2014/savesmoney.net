import StatsCards from '@/features/public/my-store/overview/StatsCard';

const Page = () => {
    const deals = [
        {
            id: 1,
            title: 'MacBook Pro M3 14 inch',
            category: 'Công nghệ',
            discount: 15,
            currentPrice: '39.990.000đ',
            originalPrice: '45.000.000đ',
            soldCount: 85,
            timeLeft: '05:12:40',
            image: 'https://images.unsplash.com/photo-1517336714460-4c5049c11c3c?auto=format&fit=crop&q=80&w=400',
            hot: true,
        },
        {
            id: 2,
            title: 'Sony WH-1000XM5 Noise Cancelling',
            category: 'Âm thanh',
            discount: 30,
            currentPrice: '6.490.000đ',
            originalPrice: '9.200.000đ',
            soldCount: 40,
            timeLeft: '12:00:00',
            image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=400',
            hot: false,
        },
    ];

    return (
        <div className="container mx-auto py-10 px-4 md:px-8 space-y-8 bg-slate-50/50 min-h-screen">
            <StatsCards
                stats={{
                    totalDeals: 20,
                    totalLikes: 100,
                    totalPurchaseClicks: 12,
                    totalViews: 200,
                    hotDeals: 10,
                }}
            />
        </div>
    );
};

export default Page;
