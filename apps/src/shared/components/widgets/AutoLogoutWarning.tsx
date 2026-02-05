'use client';

interface AutoLogoutWarningProps {
    onStayActive: () => void;
    onLogout: () => void;
}

export default function AutoLogoutWarning({ onStayActive, onLogout }: AutoLogoutWarningProps) {
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
                <div className="flex items-center mb-4">
                    <div className="bg-yellow-100 rounded-full p-3 mr-4">
                        <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Inactivity Warning</h3>
                </div>

                <p className="text-sm text-gray-500 mb-6">Click “Continue” to keep your session active.</p>

                <div className="flex gap-3">
                    <button
                        onClick={onStayActive}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg"
                    >
                        Continue
                    </button>
                    <button
                        onClick={onLogout}
                        className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded-lg"
                    >
                        Log out
                    </button>
                </div>
            </div>
        </div>
    );
}
