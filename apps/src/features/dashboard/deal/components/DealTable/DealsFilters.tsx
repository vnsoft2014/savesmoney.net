type Props = {
    search: string;
    setSearch: (value: string) => void;
    dealTypeFilter: string;
    setDealTypeFilter: (value: string) => void;
    createdAtFrom: string;
    setCreatedAtFrom: (value: string) => void;
    createdAtTo: string;
    setCreatedAtTo: (value: string) => void;
    expireAtFrom: string;
    setExpireAtFrom: (value: string) => void;
    expireAtTo: string;
    setExpireAtTo: (value: string) => void;
    onClearFilters: () => void;
};

export default function DealsFilters({
    search,
    setSearch,
    dealTypeFilter,
    setDealTypeFilter,
    createdAtFrom,
    setCreatedAtFrom,
    createdAtTo,
    setCreatedAtTo,
    expireAtFrom,
    setExpireAtFrom,
    expireAtTo,
    setExpireAtTo,
    onClearFilters,
}: Props) {
    const hasActiveFilters = search || dealTypeFilter || createdAtFrom || createdAtTo || expireAtFrom || expireAtTo;

    return (
        <div className="flex flex-col gap-3 py-2">
            <div className="flex items-center gap-4">
                {hasActiveFilters && (
                    <button onClick={onClearFilters} className="text-sm text-red-600 hover:text-red-800 font-medium">
                        Clear All Filters
                    </button>
                )}
            </div>

            <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700">Deal Type:</label>
                    <select
                        value={dealTypeFilter}
                        onChange={(e) => setDealTypeFilter(e.target.value)}
                        className="px-3 py-1.5 border border-gray-300 rounded outline-none focus:border-indigo-600 text-sm"
                    >
                        <option value="">All Types</option>
                        {/* {dealTypes.map((type) => (
                            <option key={type._id} value={type._id}>
                                {type.name}
                            </option>
                        ))} */}
                    </select>
                </div>

                <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700">Expires:</label>
                    <input
                        type="date"
                        value={expireAtFrom}
                        onChange={(e) => setExpireAtFrom(e.target.value)}
                        className="px-3 py-1.5 border border-gray-300 rounded outline-none focus:border-indigo-600 text-sm"
                    />
                    <span className="text-gray-500">to</span>
                    <input
                        type="date"
                        value={expireAtTo}
                        onChange={(e) => setExpireAtTo(e.target.value)}
                        className="px-3 py-1.5 border border-gray-300 rounded outline-none focus:border-indigo-600 text-sm"
                    />
                </div>

                <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700">Created:</label>
                    <input
                        type="date"
                        value={createdAtFrom}
                        onChange={(e) => setCreatedAtFrom(e.target.value)}
                        className="px-3 py-1.5 border border-gray-300 rounded outline-none focus:border-indigo-600 text-sm"
                    />
                    <span className="text-gray-500">to</span>
                    <input
                        type="date"
                        value={createdAtTo}
                        onChange={(e) => setCreatedAtTo(e.target.value)}
                        className="px-3 py-1.5 border border-gray-300 rounded outline-none focus:border-indigo-600 text-sm"
                    />
                </div>

                <input
                    className="w-60 dark:bg-transparent py-2 px-3 outline-none border-b-2 border-indigo-600 focus:border-orange-700 transition-colors"
                    type="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by Deal Name"
                />
            </div>
        </div>
    );
}
