type Props = {
    search: string;
    setSearch: (v: string) => void;
};

export default function UserFilters({
    search,
    setSearch,
}: Props) {
    return (
        <div className="flex flex-wrap gap-3 items-center">
            <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name or email"
                className="border px-3 py-1 rounded"
            />
        </div>
    );
}
