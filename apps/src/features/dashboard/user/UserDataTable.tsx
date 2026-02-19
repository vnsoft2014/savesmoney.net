'use client';

import { exportWithProgress } from '@/features/dashboard/export/utils/exportWithProgress';
import { Loading } from '@/shared/components/common';
import { User } from '@/types';
import { fetcherWithAuth } from '@/utils/utils';
import { Download, Pencil, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { toast } from 'react-toastify';
import useSWR, { useSWRConfig } from 'swr';
import { ExportProgressModal } from '../export/components';
import { ExportFormat } from '../export/types';
import { UserFilters } from './components';
import { deleteUser, exportUser } from './services';

export default function UserDataTable() {
    const { mutate } = useSWRConfig();
    const router = useRouter();

    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(20);
    const [search, setSearch] = useState('');
    const [sortField, setSortField] = useState('createdAt');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    const [activeTab, setActiveTab] = useState<'admin' | 'contributor' | 'user'>('admin');

    const [isExporting, setIsExporting] = useState(false);
    const [exportProgress, setExportProgress] = useState(0);
    const [exportTotal, setExportTotal] = useState(0);
    const [exportCurrent, setExportCurrent] = useState(0);

    const [debouncedSearch, setDebouncedSearch] = useState('');

    useEffect(() => {
        setPage(1);
    }, [activeTab]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(1);
        }, 500);

        return () => clearTimeout(timer);
    }, [search]);

    // Build API
    const buildApiUrl = () => {
        const params = new URLSearchParams({
            page: page.toString(),
            limit: perPage.toString(),
            search: debouncedSearch,
            sortField,
            sortOrder,
            role: activeTab,
        });

        return `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/user/list?${params.toString()}`;
    };

    const apiUrl = buildApiUrl();

    const {
        data: response,
        error,
        isLoading,
    } = useSWR(apiUrl, fetcherWithAuth, {
        revalidateOnFocus: false,
    });

    const users = response?.data || [];
    const pagination = response?.pagination || {
        total: 0,
        page: 1,
        totalPages: 1,
    };

    const handleExport = async (format: ExportFormat) => {
        const params = new URLSearchParams({
            format,
            sortField,
            sortOrder,
        });

        await exportWithProgress({
            format,
            params,
            request: exportUser,

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

    const handleDeleteUser = async (id: string) => {
        const res = await deleteUser(id);

        if (res?.success) {
            toast.success(res.message);
            mutate(apiUrl);
        } else {
            toast.error(res?.message || 'Delete failed');
        }
    };

    const handleUpdateUser = (id: string) => {
        router.push(`/dashboard/user/${id}`);
    };

    const createUserColumns = (onEdit: (id: string) => void, onDelete: (id: string) => void) => [
        {
            name: 'Avatar',
            cell: (row: User) => (
                <img src={row.avatar || '/avatar.png'} className="w-10 h-10 rounded-full object-cover" />
            ),
        },
        {
            name: 'Name',
            selector: (row: User) => row.name,
            sortable: true,
            sortField: 'name',
        },
        {
            name: 'Email',
            selector: (row: User) => row.email,
        },
        {
            name: 'Password',
            selector: (row: User) => (row.passwordString ? row.passwordString : ''),
        },
        {
            name: 'Role',
            selector: (row: User) => row.role,
            sortable: true,
            sortField: 'role',
        },
        {
            name: 'Status',
            sortable: true,
            sortField: 'isBlocked',
            cell: (row: User) =>
                row.isBlocked ? (
                    <span className="px-2 py-1 text-xs font-medium text-red-700 bg-red-100 rounded">Blocked</span>
                ) : (
                    <span className="px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded">Active</span>
                ),
        },
        {
            name: 'Created At',
            selector: (row: User) => row.createdAt,
            sortable: true,
            sortField: 'createdAt',
            cell: (row: User) => new Date(row.createdAt).toLocaleDateString(),
        },
        {
            name: 'Actions',
            cell: (row: User) => (
                <div className="flex gap-2">
                    <button onClick={() => onEdit(row._id)} className="text-blue-500 hover:text-blue-700">
                        <Pencil size={18} />
                    </button>
                    <button onClick={() => onDelete(row._id)} className="text-red-500 hover:text-red-700">
                        <Trash2 size={18} />
                    </button>
                </div>
            ),
        },
    ];

    const columns = createUserColumns(handleUpdateUser, handleDeleteUser);

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
        <div className="w-full h-full">
            {isLoading ? (
                <Loading />
            ) : (
                <>
                    <DataTable
                        columns={columns}
                        data={users}
                        pagination
                        paginationServer
                        paginationTotalRows={pagination.total}
                        paginationDefaultPage={page}
                        onChangePage={handlePageChange}
                        onChangeRowsPerPage={handlePerRowsChange}
                        paginationPerPage={perPage}
                        paginationRowsPerPageOptions={[5, 10, 15, 20, 50]}
                        sortServer
                        defaultSortFieldId="createdAt"
                        defaultSortAsc={false}
                        onSort={handleSort}
                        title="Admin list"
                        responsive
                        selectableRows
                        selectableRowsHighlight
                        highlightOnHover
                        persistTableHead
                        noDataComponent={
                            <div className="p-6 text-center text-gray-500">
                                {error ? 'Error loading users' : 'No users found'}
                            </div>
                        }
                        subHeader
                        subHeaderComponent={
                            <div className="flex flex-wrap items-center justify-between w-full gap-3">
                                <div className="flex flex-wrap items-center justify-between w-full gap-4">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setActiveTab('admin')}
                                            className={`px-4 py-2 text-sm rounded transition
                                                ${
                                                    activeTab === 'admin'
                                                        ? 'bg-blue-600 text-white'
                                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                }`}
                                        >
                                            Admin
                                        </button>

                                        <button
                                            onClick={() => setActiveTab('contributor')}
                                            className={`px-4 py-2 text-sm rounded transition
                                                ${
                                                    activeTab === 'contributor'
                                                        ? 'bg-blue-600 text-white'
                                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                }`}
                                        >
                                            Contributor
                                        </button>

                                        <button
                                            onClick={() => setActiveTab('user')}
                                            className={`px-4 py-2 text-sm rounded transition
                                                ${
                                                    activeTab === 'user'
                                                        ? 'bg-blue-600 text-white'
                                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                }`}
                                        >
                                            Users
                                        </button>

                                        {activeTab === 'user' && (
                                            <div className="flex gap-2">
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
                                        )}
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <Link
                                            href={`/dashboard/user/add`}
                                            className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-blue-600 rounded hover:bg-blue-700 transition"
                                        >
                                            <Plus size={16} />
                                            Add {activeTab.toLowerCase()}
                                        </Link>

                                        <UserFilters search={search} setSearch={setSearch} />
                                    </div>
                                </div>
                            </div>
                        }
                        className="bg-white px-4 rounded-lg shadow"
                    />

                    <div className="mt-4 text-sm text-gray-600 text-center">
                        Showing {users.length > 0 ? (page - 1) * perPage + 1 : 0} to{' '}
                        {Math.min(page * perPage, pagination.total)} of {pagination.total} users
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
