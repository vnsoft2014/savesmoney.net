'use client';

import { deleteDeal } from '@/services/admin/deal';
import { formatPrice } from '@/utils/deal';
import { fetcherWithAuth, formatDate } from '@/utils/utils';
import { Flame, Gift, Pencil, Scale, Sun, Tag, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { toast } from 'react-toastify';
import useSWR, { useSWRConfig } from 'swr';

import { Loading } from '@/shared/components/common';
import { Deal } from '@/shared/types/deal';
import React from 'react';

interface IconWithTooltipProps {
    tooltip: string;
    children: React.ReactNode;
}

const IconWithTooltip = ({ tooltip, children }: IconWithTooltipProps) => {
    return (
        <span className="relative group inline-flex">
            {children}
            <span
                className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap
                       rounded bg-gray-900 px-2 py-1 text-[11px] text-white
                       opacity-0 group-hover:opacity-100 transition"
            >
                {tooltip}
            </span>
        </span>
    );
};

export default function UserDealsDataTable() {
    const { mutate } = useSWRConfig();
    const router = useRouter();

    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(20);
    const [search, setSearch] = useState('');
    const [sortField, setSortField] = useState('createdAt');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    // Filter states
    const [dealTypeFilter, setDealTypeFilter] = useState('');
    const [createdAtFrom, setCreatedAtFrom] = useState('');
    const [createdAtTo, setCreatedAtTo] = useState('');
    const [expireAtFrom, setExpireAtFrom] = useState('');
    const [expireAtTo, setExpireAtTo] = useState('');

    const [debouncedSearch, setDebouncedSearch] = useState('');

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(1);
        }, 500);

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

        if (dealTypeFilter) params.append('dealType', dealTypeFilter);
        if (createdAtFrom) params.append('createdAtFrom', createdAtFrom);
        if (createdAtTo) params.append('createdAtTo', createdAtTo);
        if (expireAtFrom) params.append('expireAtFrom', expireAtFrom);
        if (expireAtTo) params.append('expireAtTo', expireAtTo);

        return `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/user-store/deal/list?${params.toString()}`;
    };

    const apiUrl = buildApiUrl();

    const {
        data: response,
        error,
        isLoading,
    } = useSWR(apiUrl, fetcherWithAuth, {
        revalidateOnFocus: false,
    });

    const dealData = response?.data || [];
    const pagination = response?.pagination || {
        totalCount: 0,
        currentPage: 1,
        totalPages: 1,
    };

    const renderStatusBadge = (status: string) => {
        switch (status) {
            case 'published':
                return <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-700">Published</span>;
            case 'pending':
                return <span className="px-2 py-1 text-xs rounded bg-yellow-100 text-yellow-700">Pending</span>;
            case 'rejected':
                return <span className="px-2 py-1 text-xs rounded bg-red-100 text-red-700">Rejected</span>;
            default:
                return null;
        }
    };

    const handleChangeStatus = async (id: string, status: string) => {
        try {
            const res = await fetcherWithAuth(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/user-store/deal/${id}/status`,
                {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ status }),
                },
            );

            if (res.success) {
                toast.success('Status updated');
                mutate(apiUrl);
            } else {
                toast.error(res.message);
            }
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const handleDeleteDeal = async (id: string) => {
        const res = await deleteDeal(id);

        if (res?.success) {
            toast.success(res?.message);
            mutate(apiUrl);
        } else {
            toast.error(res?.message);
        }
    };

    const handleUpdateDeal = (id: string) => {
        router.push(`/dashboard/deal/${id}`);
    };

    const handleClearFilters = () => {
        setSearch('');
        setDealTypeFilter('');
        setCreatedAtFrom('');
        setCreatedAtTo('');
        setExpireAtFrom('');
        setExpireAtTo('');
        setPage(1);
    };

    const createDealColumns = (handleUpdate: (id: string) => void, handleDelete: (id: string) => void) => [
        {
            name: 'Image',
            cell: (row: Deal) => <img src={row.image} alt="Deal image" className="py-2 object-cover rounded" />,
            width: '120px',
        },

        {
            name: 'Deal Type',
            selector: (row: Deal) => row.dealType?.map((type: any) => type.name).join(', ') || '',
            sortable: true,
            sortField: 'dealType.name',
            width: '150px',
        },

        {
            name: 'Store',
            selector: (row: Deal) => row.store.name,
            sortable: true,
            sortField: 'store',
            width: '120px',
        },

        {
            name: 'Short Description',
            selector: (row: Deal) => row.shortDescription,
            sortable: true,
            sortField: 'shortDescription',
            width: '250px',
        },

        {
            name: 'Price',
            sortable: true,
            sortField: 'originalPrice',
            minWidth: '160px',
            cell: (row: Deal) => {
                const hasDiscount =
                    row.discountPrice &&
                    Number(row.discountPrice) > 0 &&
                    Number(row.discountPrice) < Number(row.originalPrice);

                return (
                    <div className="flex flex-col gap-0.5 text-sm">
                        <div className="flex gap-2 items-center">
                            <span
                                className={hasDiscount ? 'line-through text-gray-400' : 'font-semibold text-gray-800'}
                            >
                                {formatPrice(row.originalPrice)}
                            </span>

                            {hasDiscount && (
                                <span className="text-green-600 font-semibold">{formatPrice(row.discountPrice)}</span>
                            )}
                        </div>

                        {hasDiscount && row.percentageOff && (
                            <span className="text-xs text-red-500">Save {row.percentageOff}</span>
                        )}
                    </div>
                );
            },
        },

        {
            name: 'Expire At',
            selector: (row: Deal) => row.expireAt || '',
            sortable: true,
            sortField: 'expireAt',
            format: (row: Deal) => (row.expireAt ? formatDate(row.expireAt) : '-'),
            grow: 1,
        },

        {
            name: 'Created At',
            selector: (row: Deal) => row.createdAt,
            sortable: true,
            sortField: 'createdAt',
            format: (row: Deal) => formatDate(row.createdAt),
            grow: 1,
        },

        {
            name: 'Purchase Link',
            cell: (row: Deal) => (
                <div className="flex items-center gap-2">
                    <a
                        href={row.purchaseLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline text-sm hover:text-blue-800"
                    >
                        Open
                    </a>

                    {row.hotTrend && (
                        <IconWithTooltip tooltip="Hot Trend">
                            <span className="text-red-600">
                                <Flame size={16} />
                            </span>
                        </IconWithTooltip>
                    )}

                    {row.holidayDeals && (
                        <IconWithTooltip tooltip="Holiday Deal">
                            <span className="text-green-600">
                                <Gift size={16} />
                            </span>
                        </IconWithTooltip>
                    )}

                    {row.seasonalDeals && (
                        <IconWithTooltip tooltip="Seasonal Deal">
                            <span className="text-orange-500">
                                <Sun size={16} />
                            </span>
                        </IconWithTooltip>
                    )}

                    {row.coupon && (
                        <IconWithTooltip tooltip="Coupon Available">
                            <span className="text-yellow-600">
                                <Tag size={16} />
                            </span>
                        </IconWithTooltip>
                    )}

                    {row.clearance && (
                        <IconWithTooltip tooltip="Clearance Sale">
                            <span className="text-purple-600">
                                <Scale size={16} />
                            </span>
                        </IconWithTooltip>
                    )}
                </div>
            ),
            grow: 1,
        },

        {
            name: 'Status',
            selector: (row: Deal) => row.status,
            sortable: true,
            sortField: 'status',
            minWidth: '200px',
            cell: (row: Deal) => (
                <div className="flex items-center gap-2">
                    {renderStatusBadge(row.status)}

                    <select
                        value={row.status}
                        onChange={(e) => handleChangeStatus(row._id, e.target.value)}
                        className="text-xs border rounded px-2 py-1 bg-white"
                    >
                        <option value="pending">Pending</option>
                        <option value="published">Published</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>
            ),
        },

        {
            name: 'Action',
            grow: 1,
            cell: (row: Deal) => (
                <div className="flex items-center gap-2 h-20">
                    <button
                        onClick={() => handleUpdate(row._id)}
                        className="px-3 py-2 text-xs text-green-600 hover:text-white hover:bg-green-600 border border-green-600 rounded transition"
                    >
                        <Pencil size={18} />
                    </button>

                    <button
                        onClick={() => handleDelete(row._id)}
                        className="px-3 py-2 text-xs text-red-600 hover:text-white hover:bg-red-600 border border-red-600 rounded transition"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            ),
            width: '180px',
        },
    ];

    const columns = createDealColumns(handleUpdateDeal, handleDeleteDeal);

    const handleSort = (column: any, sortDirection: 'asc' | 'desc') => {
        if (!column.sortField) return;

        setSortField(column.sortField);
        setSortOrder(sortDirection);
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    const handlePerRowsChange = (newPerPage: number, newPage: number) => {
        setPerPage(newPerPage);
        setPage(newPage);
    };

    return (
        <div className="w-full h-full data-table">
            {isLoading ? (
                <Loading />
            ) : (
                <>
                    <DataTable
                        columns={columns}
                        data={dealData}
                        pagination
                        paginationServer
                        paginationTotalRows={pagination.totalCount}
                        paginationDefaultPage={page}
                        onChangePage={handlePageChange}
                        onChangeRowsPerPage={handlePerRowsChange}
                        paginationPerPage={perPage}
                        paginationRowsPerPageOptions={[5, 10, 15, 20, 25, 50]}
                        sortServer
                        defaultSortFieldId="createdAt"
                        defaultSortAsc={false}
                        onSort={handleSort}
                        title="User deals list"
                        responsive
                        fixedHeader={false}
                        selectableRows
                        selectableRowsHighlight
                        highlightOnHover
                        persistTableHead
                        noDataComponent={
                            <div className="p-6 text-center text-gray-500">
                                {error ? 'Error loading deals' : 'No deals found'}
                            </div>
                        }
                        subHeader
                        className="bg-white px-4 rounded-lg shadow"
                    />

                    <div className="mt-4 text-sm text-gray-600 text-center">
                        Showing {dealData.length > 0 ? (page - 1) * perPage + 1 : 0} to{' '}
                        {Math.min(page * perPage, pagination.totalCount)} of {pagination.totalCount} deals
                    </div>
                </>
            )}
        </div>
    );
}
