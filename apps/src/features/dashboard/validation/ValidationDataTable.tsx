'use client';

import { Check, CheckCircle, Clock, Loader2, Pencil, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import DataTable from 'react-data-table-component';
import useSWR, { useSWRConfig } from 'swr';

import Loading from '@/shared/components/common/Loading';
import { ValidationData } from '@/types';
import { fetcherWithAuth, formatDate } from '@/utils/utils';
import { toast } from 'react-toastify';
import { updateValidationStatus } from './services';

export default function ValidationDataTable() {
    const { mutate } = useSWRConfig();
    const router = useRouter();

    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(20);

    const [status, setStatus] = useState<'all' | 'valid' | 'invalid'>('all');
    const [marked, setMarked] = useState<'all' | 'true' | 'false'>('all');

    const [updatingDealId, setUpdatingDealId] = useState<string | null>(null);

    const buildApiUrl = () => {
        const params = new URLSearchParams({
            page: page.toString(),
            limit: perPage.toString(),
        });

        if (status !== 'all') {
            params.set('status', status);
        }

        if (marked !== 'all') {
            params.set('marked', marked);
        }

        return `/api/admin/validation/list?${params.toString()}`;
    };

    const apiUrl = buildApiUrl();

    const { data, isLoading } = useSWR(apiUrl, fetcherWithAuth, {
        revalidateOnFocus: false,
    });

    const handleUpdateValidationStatus = async (dealId: string, invalid: boolean) => {
        setUpdatingDealId(dealId);

        const res = await updateValidationStatus(dealId, invalid);

        if (res?.success) {
            toast.success(res.message);
            mutate(apiUrl);
        } else {
            toast.error(res?.message);
        }

        setUpdatingDealId(null);
    };

    const validations: ValidationData[] = data?.data || [];
    const pagination = data?.pagination || {
        total: 0,
        page: 1,
        totalPages: 1,
    };

    const columns = [
        {
            name: 'Image',
            cell: (row: ValidationData) => (
                <img src={row.deal.image} alt="Deal image" className="w-14 h-14 py-1 object-cover rounded" />
            ),
        },
        {
            name: 'Name',
            selector: (row: ValidationData) => row.deal.shortDescription,
            sortable: true,
            sortField: 'name',
        },

        {
            name: 'Expire At',
            selector: (row: ValidationData) => row.deal.expireAt || '',
            sortable: true,
            sortField: 'expireAt',
            format: (row: ValidationData) => (row.deal.expireAt ? formatDate(row.deal.expireAt) : '-'),
            grow: 1,
        },
        {
            name: 'Valid Count',
            selector: (row: ValidationData) => row.valid,
        },
        {
            name: 'Invalid Count',
            selector: (row: ValidationData) => row.invalid,
        },
        {
            name: 'Valid',
            cell: (row: ValidationData) => {
                const invalid = row.deal.status !== 'published';
                const expireAt = row.deal.expireAt ? new Date(row.deal.expireAt) : null;

                const now = new Date();

                if (invalid === true || (expireAt && expireAt < now)) {
                    return <X size={18} className="text-red-500" />;
                }

                return <Check size={18} className="text-green-500" />;
            },
        },

        {
            name: 'Store',
            cell: (row: ValidationData) => (
                <div className="flex items-center gap-2">
                    <a
                        href={row.deal.purchaseLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline text-sm hover:text-blue-800"
                    >
                        Open
                    </a>
                </div>
            ),
            grow: 1,
        },
        {
            name: 'Marked',
            center: true,
            cell: (row: ValidationData) => {
                const marked = row.marked;

                if (marked === true) {
                    return <CheckCircle size={18} className="text-blue-600" />;
                }

                return <Clock size={18} className="text-gray-400" />;
            },
        },

        {
            name: 'Action',
            center: true,
            cell: (row: ValidationData) => {
                const isUpdating = updatingDealId === row.deal._id;
                return (
                    <div className="flex items-center gap-2">
                        {isUpdating ? (
                            <Loader2 size={18} className="animate-spin" />
                        ) : (
                            <>
                                <button
                                    title="Mark as valid"
                                    onClick={() => handleUpdateValidationStatus(row.deal._id, false)}
                                    className="px-2 py-2 border rounded transition border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
                                >
                                    <Check size={16} />
                                </button>

                                <button
                                    title="Mark as invalid"
                                    onClick={() => handleUpdateValidationStatus(row.deal._id, true)}
                                    className="px-2 py-2 border rounded transition border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                                >
                                    <X size={16} />
                                </button>
                            </>
                        )}

                        <button
                            onClick={() => router.push(`/dashboard/deal/${row.deal._id}`)}
                            className="px-2 py-2 border border-green-600 text-green-600 hover:bg-green-600 hover:text-white rounded transition"
                        >
                            <Pencil size={16} />
                        </button>
                    </div>
                );
            },
        },
    ];

    return (
        <div className="w-full h-full">
            {isLoading ? (
                <Loading />
            ) : (
                <>
                    <DataTable
                        title="Deal Validations"
                        columns={columns}
                        data={validations}
                        pagination
                        paginationServer
                        subHeader
                        subHeaderComponent={
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <label className="text-sm font-medium text-gray-600">Status:</label>
                                    <select
                                        value={status}
                                        onChange={(e) => {
                                            setStatus(e.target.value as 'all' | 'valid' | 'invalid');
                                            setPage(1);
                                        }}
                                        className="border rounded-md px-3 py-1.5 text-sm"
                                    >
                                        <option value="all">All</option>
                                        <option value="valid">Valid</option>
                                        <option value="invalid">Invalid</option>
                                    </select>
                                </div>

                                <div className="flex items-center gap-2">
                                    <label className="text-sm font-medium text-gray-600">Marked:</label>
                                    <select
                                        value={marked}
                                        onChange={(e) => {
                                            setMarked(e.target.value as 'all' | 'true' | 'false');
                                            setPage(1);
                                        }}
                                        className="border rounded-md px-3 py-1.5 text-sm"
                                    >
                                        <option value="all">All</option>
                                        <option value="true">Marked</option>
                                        <option value="false">Unmarked</option>
                                    </select>
                                </div>
                            </div>
                        }
                        paginationTotalRows={pagination.total}
                        paginationDefaultPage={page}
                        onChangePage={setPage}
                        onChangeRowsPerPage={(newPerPage, newPage) => {
                            setPerPage(newPerPage);
                            setPage(newPage);
                        }}
                        paginationPerPage={perPage}
                        sortServer
                        selectableRows
                        selectableRowsHighlight
                        highlightOnHover
                        persistTableHead
                        noDataComponent={<div className="p-6 text-gray-500">No deal validations found</div>}
                        className="bg-white px-4 rounded-lg shadow"
                    />

                    <div className="mt-4 text-sm text-center text-gray-600">
                        Showing {validations.length > 0 ? (page - 1) * perPage + 1 : 0} –{' '}
                        {Math.min(page * perPage, pagination.total)} of {pagination.total}
                    </div>
                </>
            )}
        </div>
    );
}
