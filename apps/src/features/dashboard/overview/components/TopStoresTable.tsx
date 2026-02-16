interface Props {
    stores: any[];
}

export default function TopStoresTable({ stores }: Props) {
    return (
        <div className="overflow-hidden rounded-lg border">
            <table className="w-full text-sm">
                <thead className="bg-muted">
                    <tr>
                        <th className="p-3 text-left">Store</th>
                        <th className="p-3 text-left">Deals</th>
                        <th className="p-3 text-left">Views</th>
                        <th className="p-3 text-left">Likes</th>
                        <th className="p-3 text-left">Score</th>
                    </tr>
                </thead>
                <tbody>
                    {stores.map((store, index) => (
                        <tr key={index} className="border-t">
                            <td className="p-3 font-medium">{store.name}</td>
                            <td className="p-3">{store.totalDeals}</td>
                            <td className="p-3">{store.totalViews}</td>
                            <td className="p-3">{store.totalLikes}</td>
                            <td className="p-3 font-semibold">{store.score}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
