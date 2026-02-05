'use client';

import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { toast } from 'react-toastify';
import useSWR, { useSWRConfig } from 'swr';

import Loading from '@/shared/components/common/Loading';
import { DealType } from '@/shared/types';
import { fetcherWithAuth } from '@/utils/utils';
import { deleteDealType } from './services';

export default function DealTypeDataTable() {
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

        return `/api/common/deal-type/list?${params.toString()}`;
    };

    const apiUrl = buildApiUrl();

    const { data, isLoading } = useSWR(apiUrl, fetcherWithAuth, {
        revalidateOnFocus: false,
    });

    const dealTypes: DealType[] = data?.data || [];
    const pagination = data?.pagination || {
        total: 0,
        page: 1,
        totalPages: 1,
    };

    const handleDelete = async (id: string) => {
        const res = await deleteDealType(id);

        if (res?.success) {
            toast.success(res.message);
            mutate(apiUrl);
        } else {
            toast.error(res?.message);
        }
    };

    const columns = [
        {
            name: 'Image',
            cell: (row: DealType) => (
                <img src={row.thumbnail || 'image.png'} alt="Deal type image" className="py-2 object-cover rounded" />
            ),
            width: '120px',
        },
        {
            name: 'Name',
            selector: (row: DealType) => row.name,
            sortable: true,
            sortField: 'name',
        },
        {
            name: 'Slug',
            selector: (row: DealType) => row.slug,
        },
        {
            name: 'Action',
            cell: (row: DealType) => (
                <div className="flex gap-2">
                    <button
                        onClick={() => router.push(`/dashboard/deal-type/${row._id}`)}
                        className="px-3 py-1 text-xs border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white rounded"
                    >
                        <Pencil size={18} />
                    </button>

                    <button
                        onClick={() => handleDelete(row._id)}
                        className="px-3 py-1 text-xs border border-red-600 text-red-600 hover:bg-red-600 hover:text-white rounded"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div className="w-full h-full">
            {isLoading ? (
                <Loading />
            ) : (
                <>
                    <DataTable
                        title="Deal Types"
                        columns={columns}
                        data={dealTypes}
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
                                    onClick={() => router.push('/dashboard/deal-type/add')}
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    <Plus size={16} />
                                    Add Deal Type
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
                        Showing {dealTypes.length > 0 ? (page - 1) * perPage + 1 : 0} –{' '}
                        {Math.min(page * perPage, pagination.total)} of {pagination.total}
                    </div>
                </>
            )}
        </div>
    );
}
