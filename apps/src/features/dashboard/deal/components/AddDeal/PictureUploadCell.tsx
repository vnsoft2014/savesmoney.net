import { uploadImage } from '@/services/upload';
import { DealFormValues } from '@/shared/types';
import { checkFile } from '@/utils/validators/file-checker';
import { Clipboard, Upload } from 'lucide-react';
import { memo, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { useDealContext } from '../../contexts';

type Props = {
    deal: DealFormValues;
    error: any;
};

const PictureUploadCell = ({ deal, error }: Props) => {
    const { focusedDealId, setFocusedDealId, updateDeal } = useDealContext();

    const [uploadingImages, setUploadingImages] = useState<{ [key: number]: boolean }>({});

    useEffect(() => {
        const handleGlobalPaste = async (e: ClipboardEvent) => {
            if (!focusedDealId) return;

            const items = e.clipboardData?.items;
            if (!items) return;

            for (let i = 0; i < items.length; i++) {
                const item = items[i];

                if (item.type.indexOf('image') !== -1) {
                    e.preventDefault();
                    const file = item.getAsFile();
                    if (file) {
                        const fakeEvent = {
                            target: {
                                files: [file],
                            },
                        };
                        await handleImageUpload(focusedDealId, fakeEvent);
                    }
                    break;
                }
            }
        };

        document.addEventListener('paste', handleGlobalPaste);
        return () => {
            document.removeEventListener('paste', handleGlobalPaste);
        };
    }, [focusedDealId]);

    const handleImageUpload = async (id: number, e: React.ChangeEvent<HTMLInputElement> | any): Promise<void> => {
        const file = e.target.files?.[0];

        const fileValid = checkFile(file);
        if (!fileValid.isValid) {
            toast.error(fileValid.message);
        }

        setUploadingImages((prev) => ({ ...prev, [id]: true }));

        const reader = new FileReader();
        reader.onloadend = () => {
            updateDeal(id, 'picture', reader.result as string);
        };
        reader.readAsDataURL(file);

        const formData = new FormData();
        formData.append('file', file);

        const { success, data, message } = await uploadImage(formData);

        if (success) {
            updateDeal(id, 'picture', data.url);
            toast.success(message);
        } else {
            toast.error(message);
            updateDeal(id, 'picture', null);
        }

        setUploadingImages((prev) => ({ ...prev, [id]: false }));
    };

    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const containerRef = useRef(null);

    const handleContainerClick = () => {
        if (focusedDealId !== deal.id) {
            setFocusedDealId(deal.id);
            return;
        }

        fileInputRef.current?.click();
        setFocusedDealId(null);
    };

    return (
        <td className="px-4 py-3">
            <div className="flex flex-col items-center gap-2">
                {uploadingImages[deal.id] && (
                    <div className="text-xs text-blue-600 font-medium animate-pulse">Uploading...</div>
                )}

                {deal.picture && (
                    <div className="relative group">
                        <img
                            src={deal.picture}
                            alt="Deal"
                            className="w-20 h-20 object-cover rounded-lg border-2 border-gray-300 shadow-sm"
                        />
                        <button
                            onClick={handleContainerClick}
                            className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg"
                            title="Change image"
                        >
                            <Upload size={20} className="text-white" />
                        </button>
                    </div>
                )}

                {!deal.picture && (
                    <div
                        ref={containerRef}
                        tabIndex={0}
                        onClick={handleContainerClick}
                        className={`w-full border-2 border-dashed rounded-lg p-3 text-center cursor-pointer transition-all outline-none ${
                            uploadingImages[deal.id]
                                ? 'border-gray-300 bg-gray-50 cursor-not-allowed opacity-50'
                                : focusedDealId === deal.id
                                  ? 'border-blue-500 bg-blue-100 ring-2 ring-blue-300'
                                  : 'border-blue-300 bg-blue-50 hover:bg-blue-100 hover:border-blue-400'
                        }`}
                        title="Click to upload or focus and press Ctrl+V to paste"
                    >
                        <div className="flex flex-col items-center gap-1">
                            <Clipboard size={20} className="text-blue-600" />
                            <span className="text-xs text-gray-600 font-medium">
                                {focusedDealId === deal.id ? 'Press Ctrl+V' : 'Click or Focus'}
                            </span>
                        </div>
                    </div>
                )}

                <input
                    key={deal.id}
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                    onChange={(e) => handleImageUpload(deal.id, e)}
                    disabled={uploadingImages[deal.id]}
                    className="hidden"
                />

                {error && <span className="text-xs text-red-500 font-medium">{error}</span>}
            </div>
        </td>
    );
};

export default memo(PictureUploadCell);
