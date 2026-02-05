'use client';

import { Pencil, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { toast } from 'react-toastify';
import useSWR, { useSWRConfig } from 'swr';

import Loading from '@/shared/components/common/Loading';
import { CommentData } from '@/types';
import { fetcherWithAuth } from '@/utils/utils';
import Link from 'next/link';
import { deleteComment, updateApprove } from './services';

function ApproveSwitch({ checked, onChange }: { checked: boolean; onChange: (val: boolean) => void }) {
    return (
        <button
            onClick={() => onChange(!checked)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition
        ${checked ? 'bg-green-600' : 'bg-gray-300'}`}
        >
            <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition
          ${checked ? 'translate-x-6' : 'translate-x-1'}`}
            />
        </button>
    );
}

export default function CommentDataTable() {
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

        return `/api/admin/comment/list?${params.toString()}`;
    };

    const apiUrl = buildApiUrl();

    const { data, isLoading } = useSWR(apiUrl, fetcherWithAuth, {
        revalidateOnFocus: false,
    });

    const comments: CommentData[] = data?.data || [];
    const pagination = data?.pagination || {
        total: 0,
        page: 1,
        totalPages: 1,
    };

    const handleDelete = async (id: string) => {
        const res = await deleteComment(id);

        if (res?.success) {
            toast.success(res.message);
            mutate(apiUrl);
        } else {
            toast.error(res?.message || 'Delete failed');
        }
    };

    const handleToggleApprove = async (row: CommentData) => {
        const res = await updateApprove(row._id, !row.isApproved);

        if (res?.success) {
            toast.success(res.message);
            mutate(apiUrl);
        } else {
            toast.error(res?.message || 'Update failed');
        }
    };

    const columns = [
        {
            name: 'Name',
            selector: (row: CommentData) => row.content,
            sortable: true,
            sortField: 'name',
        },
        {
            name: 'Deal',
            cell: (row: CommentData) =>
                row.deal && typeof row.deal === 'object' ? (
                    <Link href={`/deals/deal-detail/${row.deal._id}`}>{row.deal.shortDescription}</Link>
                ) : (
                    '-'
                ),
        },
        {
            name: 'User',
            cell: (row: CommentData) =>
                row.user && typeof row.user === 'object' ? (
                    <Link href={`/dashboard/user/${row.user._id}`}>{row.user.name}</Link>
                ) : (
                    '-'
                ),
        },
        {
            name: 'Approved',
            center: true,
            cell: (row: CommentData) => (
                <ApproveSwitch checked={row.isApproved} onChange={() => handleToggleApprove(row)} />
            ),
        },
        {
            name: 'Action',
            cell: (row: CommentData) => (
                <div className="flex gap-2">
                    <button
                        onClick={() => router.push(`/dashboard/comment/${row._id}`)}
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
                        title="Comments"
                        columns={columns}
                        data={comments}
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
                                <input
                                    type="text"
                                    placeholder="Search comment..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="border px-3 py-2 rounded w-64"
                                />
                            </div>
                        }
                        noDataComponent={<div className="p-6 text-gray-500">No comments found</div>}
                        className="bg-white px-4 rounded-lg shadow"
                    />

                    <div className="mt-4 text-sm text-center text-gray-600">
                        Showing {comments.length > 0 ? (page - 1) * perPage + 1 : 0} –{' '}
                        {Math.min(page * perPage, pagination.total)} of {pagination.total}
                    </div>
                </>
            )}
        </div>
    );
}
