'use client';

import { X } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill-new'), {
    ssr: false,
});

type Props = {
    isOpen: boolean;
    onClose: () => void;
    value: string;
    onChange: (value: string) => void;
};

export default function QuillEditorModal({ isOpen, onClose, value, onChange }: Props) {
    const [localValue, setLocalValue] = useState(value);

    useEffect(() => {
        setLocalValue(value);
    }, [value]);

    const handleSave = () => {
        onChange(localValue);
        setLocalValue('');

        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-xl font-semibold">Edit Description</h2>
                    <button onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                <div className="flex-1 p-4 overflow-y-auto">
                    <ReactQuill
                        style={{ height: '500px' }}
                        theme="snow"
                        value={localValue}
                        onChange={setLocalValue}
                        placeholder="Enter deal description..."
                        modules={{
                            toolbar: [
                                [{ header: [1, 2, 3, false] }],
                                ['bold', 'italic', 'underline', 'strike'],
                                [{ list: 'ordered' }, { list: 'bullet' }],
                                [{ color: [] }, { background: [] }],
                                ['link'],
                                ['clean'],
                            ],
                        }}
                    />

                    <div className="mt-3 text-sm text-gray-500 text-right">
                        {localValue.replace(/<[^>]*>/g, '').length} characters
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 p-4 border-t bg-gray-50">
                    <button onClick={onClose} className="px-4 py-2 border rounded">
                        Cancel
                    </button>
                    <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded">
                        Save Description
                    </button>
                </div>
            </div>
        </div>
    );
}
