import { Loader2, X } from 'lucide-react';

export default function ExportProgressModal({
    isOpen,
    progress,
    total,
    current,
    onClose,
}: {
    isOpen: boolean;
    progress: number;
    total: number;
    current: number;
    onClose: () => void;
}) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96 shadow-xl">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Exporting Data</h3>
                    {progress === 100 && (
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                            <X size={20} />
                        </button>
                    )}
                </div>

                <div className="space-y-4">
                    <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                        <div
                            className="bg-blue-600 h-full transition-all duration-300 ease-out flex items-center justify-center"
                            style={{ width: `${progress}%` }}
                        >
                            <span className="text-xs text-white font-medium">{progress}%</span>
                        </div>
                    </div>

                    <div className="text-sm text-gray-600 text-center">
                        {progress < 100 ? (
                            <>
                                Processing {current} of {total} records...
                            </>
                        ) : (
                            <span className="text-green-600 font-medium">Export completed!</span>
                        )}
                    </div>

                    {progress > 100 && (
                        <div className="flex justify-center">
                            <Loader2 className="mr-2 h-10 w-10 animate-spin text-blue-600" />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
