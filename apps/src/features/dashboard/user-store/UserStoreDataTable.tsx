'use client';

import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import useSWR, { useSWRConfig } from 'swr';

import Loading from '@/shared/components/common/Loading';
import { UserStore } from '@/shared/types';
import { fetcherWithAuth } from '@/utils/utils';

export default function UserStoreDataTable() {
    const router = useRouter();
    const { mutate } = useSWRConfig();

    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(20);
    const [search, setSearch] = useState('');
    const [sortField, setSortField] = useState('_id');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    // debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(1);
        }, 400);

        return () => clearTimeout(timer);
    }, [search]);

    const buildApiUrl = () => {
        const params = new URLSearchParams({
            page: page.toString(),
            limit: perPage.toString(),
            search: debouncedSearch,
            sortField,
            sortOrder,
        });

        return `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/user-store/store/list?${params.toString()}`;
    };

    const apiUrl = buildApiUrl();

    const { data, isLoading } = useSWR(apiUrl, fetcherWithAuth, {
        revalidateOnFocus: false,
    });

    const stores: UserStore[] = data?.data || [];
    const pagination = data?.pagination || {
        total: 0,
        page: 1,
        totalPages: 1,
    };

    const handleToggleStatus = async (id: string, currentStatus: boolean) => {
        try {
            const res = await fetcherWithAuth(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/user-store/store/${id}/status`,
                {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ isActive: !currentStatus }),
                },
            );

            if (res.success) {
                await mutate(apiUrl);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const columns = [
        {
            name: 'Image',
            cell: (row: UserStore) => (
                <img src={row.logo || '/image.png'} alt="Store image" className="py-2 object-cover rounded" />
            ),
            width: '120px',
        },
        {
            name: 'Name',
            selector: (row: UserStore) => row.name,
            sortable: true,
            sortField: 'name',
        },
        {
            name: 'Slug',
            selector: (row: UserStore) => row.slug,
        },
        {
            name: 'Total revenue',
            selector: (row: UserStore) => row.totalRevenue || 0,
        },
        {
            name: 'Status',
            selector: (row: UserStore) => row.isActive,
            sortable: true,
            sortField: 'isActive',
            cell: (row: UserStore) => (
                <div className="flex items-center gap-2">
                    <span
                        className={`px-2 py-1 text-xs rounded ${
                            row.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}
                    >
                        {row.isActive ? 'Active' : 'Inactive'}
                    </span>

                    <button
                        onClick={() => handleToggleStatus(row._id, row.isActive)}
                        className={`px-2 py-1 text-xs rounded border ${
                            row.isActive
                                ? 'border-red-500 text-red-600 hover:bg-red-600 hover:text-white'
                                : 'border-green-500 text-green-600 hover:bg-green-600 hover:text-white'
                        }`}
                    >
                        {row.isActive ? 'Disable' : 'Enable'}
                    </button>
                </div>
            ),
            width: '180px',
        },
    ];

    return (
        <div className="w-full h-full">
            {isLoading ? (
                <Loading />
            ) : (
                <>
                    <DataTable
                        title="Stores"
                        columns={columns}
                        data={stores}
                        pagination
                        paginationServer
                        paginationTotalRows={pagination.total}
                        paginationDefaultPage={page}
                        onChangePage={setPage}
                        onChangeRowsPerPage={(newPerPage, newPage) => {
                            setPerPage(newPerPage);
                            setPage(newPage);
                        }}
                        paginationPerPage={perPage}
                        sortServer
                        onSort={(column, direction) => {
                            if (!column.sortField) return;
                            setSortField(column.sortField);
                            setSortOrder(direction);
                        }}
                        selectableRows
                        selectableRowsHighlight
                        highlightOnHover
                        persistTableHead
                        subHeader
                        subHeaderComponent={
                            <div className="flex justify-between items-center w-full gap-4">
                                <button
                                    onClick={() => router.push('/dashboard/store/add')}
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    <Plus size={16} />
                                    Add Store
                                </button>

                                <input
                                    type="text"
                                    placeholder="Search deal type..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="border px-3 py-2 rounded w-64"
                                />
                            </div>
                        }
                        noDataComponent={<div className="p-6 text-gray-500">No deal types found</div>}
                        className="bg-white px-4 rounded-lg shadow"
                    />

                    <div className="mt-4 text-sm text-center text-gray-600">
                        Showing {stores.length > 0 ? (page - 1) * perPage + 1 : 0} –{' '}
                        {Math.min(page * perPage, pagination.total)} of {pagination.total}
                    </div>
                </>
            )}
        </div>
    );
}
