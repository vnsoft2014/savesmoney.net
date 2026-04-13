'use client';

import { Check, Loader2, Pencil, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import DataTable from 'react-data-table-component';
import useSWR, { useSWRConfig } from 'swr';

import Loading from '@/components/common/Loading';
import { dataTableStyles } from '@/config/layout';
import { cn, fetcherWithAuth, formatDate } from '@/lib/utils';
import { ValidationData } from '@/types';
import { toast } from 'react-toastify';
import { updateValidationStatus } from '../services';

export default function PendingDealsDataTable() {
    const { mutate } = useSWRConfig();
    const router = useRouter();

    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(20);

    const [updatingDealId, setUpdatingDealId] = useState<string | null>(null);

    const buildApiUrl = () => {
        const params = new URLSearchParams({
            page: page.toString(),
            limit: perPage.toString(),
            marked: 'false',
        });

        return `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/validation/list?${params.toString()}`;
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
            width: '120px',
        },
        {
            name: 'Name',
            selector: (row: ValidationData) => row.deal.shortDescription,
            sortable: true,
            sortField: 'name',
            width: '250px',
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
                const invalid = row.deal.status === 'invalid';
                const expireAt = row.deal.expireAt ? new Date(row.deal.expireAt) : null;

                const now = new Date();

                if (invalid === true || (expireAt && expireAt < now)) {
                    return <X size={18} className="text-red-500" />;
                }

                return <Check size={18} className="text-green-500" />;
            },
        },

        {
            name: 'Deal Link',
            cell: (row: ValidationData) => (
                <a
                    href={`/deals/deal-detail/${row.deal.slug}-${row.deal._id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline text-sm hover:text-blue-800"
                >
                    Open
                </a>
            ),
            grow: 1,
        },
        {
            name: 'Expired',
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
                                    title="Mark as invalid"
                                    onClick={() => handleUpdateValidationStatus(row.deal._id, true)}
                                    className={cn(
                                        'px-2 py-2 border rounded border-orange-600 transition-colors',
                                        row.deal.status === 'invalid'
                                            ? 'bg-orange-600 text-white hover:bg-white hover:text-orange-600'
                                            : 'bg-white text-orange-600 hover:bg-orange-600 hover:text-white',
                                    )}
                                >
                                    Yes
                                </button>
                                <button
                                    title="Mark as valid"
                                    onClick={() => handleUpdateValidationStatus(row.deal._id, false)}
                                    className={cn(
                                        'px-2 py-2 border rounded border-green-600 transition-colors',
                                        row.deal.status === 'published'
                                            ? 'bg-green-600 text-white hover:bg-white hover:text-green-600'
                                            : 'bg-white text-green-600 hover:bg-green-600 hover:text-white',
                                    )}
                                >
                                    No
                                </button>
                            </>
                        )}
                    </div>
                );
            },
            width: '120px',
        },
        {
            name: 'Action',
            center: true,
            cell: (row: ValidationData) => {
                return (
                    <div className="flex items-center gap-2">
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
                        customStyles={dataTableStyles}
                        title="Deal Validations"
                        columns={columns}
                        data={validations}
                        pagination
                        paginationServer
                        subHeader
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

                    <div className="mt-4 pb-6 text-sm text-center text-gray-600">
                        Showing {validations.length > 0 ? (page - 1) * perPage + 1 : 0} –{' '}
                        {Math.min(page * perPage, pagination.total)} of {pagination.total}
                    </div>
                </>
            )}
        </div>
    );
}
