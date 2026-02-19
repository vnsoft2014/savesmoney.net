'use client';

import { Download, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import DataTable from 'react-data-table-component';
import { toast } from 'react-toastify';
import useSWR, { useSWRConfig } from 'swr';

import Loading from '@/shared/components/common/Loading';
import { SubscriberData } from '@/types';
import { fetcherWithAuth, formatDate } from '@/utils/utils';

import { exportWithProgress } from '@/features/dashboard/export/utils/exportWithProgress';
import { ExportProgressModal } from '../export/components';
import { ExportFormat } from '../export/types';
import { deleteSubscriber, exportSubscriber } from './services';

export default function SubscriberDataTable() {
    const router = useRouter();
    const { mutate } = useSWRConfig();

    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(20);
    const [sortField, setSortField] = useState('_id');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    const [subscribedAtFrom, setSubscriberAtFrom] = useState('');
    const [subscribedAtTo, setSubscriberAtTo] = useState('');

    // Export progress states
    const [isExporting, setIsExporting] = useState(false);
    const [exportProgress, setExportProgress] = useState(0);
    const [exportTotal, setExportTotal] = useState(0);
    const [exportCurrent, setExportCurrent] = useState(0);

    const buildApiUrl = () => {
        const params = new URLSearchParams({
            page: page.toString(),
            limit: perPage.toString(),
            sortField,
            sortOrder,
        });

        if (subscribedAtFrom) params.append('subscribedAtFrom', subscribedAtFrom);
        if (subscribedAtTo) params.append('subscribedAtTo', subscribedAtTo);

        return `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/subscriber/list?${params.toString()}`;
    };

    const apiUrl = buildApiUrl();

    const { data, isLoading } = useSWR(apiUrl, fetcherWithAuth, {
        revalidateOnFocus: false,
    });

    const subscribers: SubscriberData[] = data?.data || [];
    const pagination = data?.pagination || {
        total: 0,
        page: 1,
        totalPages: 1,
    };

    const handleDelete = async (id: string) => {
        const res = await deleteSubscriber(id);

        if (res?.success) {
            toast.success(res.message);
            mutate(apiUrl);
        } else {
            toast.error(res?.message || 'Delete failed');
        }
    };

    const handleExport = async (format: ExportFormat) => {
        const params = new URLSearchParams({
            format,
            sortField,
            sortOrder,
        });

        if (subscribedAtFrom) params.append('subscribedAtFrom', subscribedAtFrom);
        if (subscribedAtTo) params.append('subscribedAtTo', subscribedAtTo);

        await exportWithProgress({
            format,
            params,
            request: exportSubscriber,

            onStart: () => {
                setIsExporting(true);
                setExportProgress(0);
                setExportTotal(0);
                setExportCurrent(0);
            },

            onProgress: ({ progress, total, current }) => {
                setExportProgress(progress);
                setExportTotal(total);
                setExportCurrent(current);
            },

            onSuccess: () => {
                toast.success('Export completed successfully!');
            },

            onError: (err) => {
                console.error(err);
                toast.error('Export failed. Please try again.');
            },

            onFinish: () => {
                setTimeout(() => setIsExporting(false), 1000);
            },
        });
    };

    const columns = [
        {
            name: 'Name',
            selector: (row: SubscriberData) => row.name,
            sortable: true,
            sortField: 'name',
        },
        {
            name: 'Email',
            selector: (row: SubscriberData) => row.email,
        },
        {
            name: 'Subscribed At',
            selector: (row: SubscriberData) => formatDate(row.subscribedAt),
            sortable: true,
            sortField: 'name',
        },
        {
            name: 'Action',
            cell: (row: SubscriberData) => (
                <div className="flex gap-2">
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
                        title="Subscribers"
                        columns={columns}
                        data={subscribers}
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
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleExport('txt')}
                                        disabled={isExporting}
                                        className="px-3 py-2 text-sm border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                    >
                                        <Download size={16} />
                                        Export TXT
                                    </button>

                                    <button
                                        onClick={() => handleExport('xlsx')}
                                        disabled={isExporting}
                                        className="px-3 py-2 text-sm border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                    >
                                        <Download size={16} />
                                        Export Excel
                                    </button>
                                </div>

                                <div className="flex items-center gap-2">
                                    <label className="text-sm font-medium text-gray-700">Expires:</label>
                                    <input
                                        type="date"
                                        value={subscribedAtFrom}
                                        onChange={(e) => setSubscriberAtFrom(e.target.value)}
                                        className="px-3 py-1.5 border border-gray-300 rounded outline-none focus:border-orange-600 text-sm"
                                    />
                                    <span className="text-gray-500">to</span>
                                    <input
                                        type="date"
                                        value={subscribedAtTo}
                                        onChange={(e) => setSubscriberAtTo(e.target.value)}
                                        className="px-3 py-1.5 border border-gray-300 rounded outline-none focus:border-orange-600 text-sm"
                                    />
                                </div>
                            </div>
                        }
                        noDataComponent={<div className="p-6 text-gray-500">No subscribers found</div>}
                        className="bg-white px-4 rounded-lg shadow"
                    />

                    <div className="mt-4 text-sm text-center text-gray-600">
                        Showing {subscribers.length > 0 ? (page - 1) * perPage + 1 : 0} –{' '}
                        {Math.min(page * perPage, pagination.total)} of {pagination.total}
                    </div>

                    <ExportProgressModal
                        isOpen={isExporting}
                        progress={exportProgress}
                        total={exportTotal}
                        current={exportCurrent}
                        onClose={() => setIsExporting(false)}
                    />
                </>
            )}
        </div>
    );
}
