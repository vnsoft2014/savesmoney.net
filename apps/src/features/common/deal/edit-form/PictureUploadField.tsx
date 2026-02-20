'use client';

import { Clipboard, Loader2, Upload } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { toast } from 'react-toastify';

import { uploadImage } from '@/services/upload';
import { Button } from '@/shared/shadecn/ui/button';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/shadecn/ui/form';
import { checkFile } from '@/utils/validators/file-checker';

type Props = {
    name: string;
};

export default function PictureUploadField({ name }: Props) {
    const { control, setValue, getValues } = useFormContext();
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        const handlePaste = async (e: ClipboardEvent) => {
            const items = e.clipboardData?.items;
            if (!items) return;

            for (const item of items) {
                if (item.type.startsWith('image')) {
                    e.preventDefault();
                    const file = item.getAsFile();
                    if (file) {
                        await handleUploadImage(file);
                    }
                    break;
                }
            }
        };

        document.addEventListener('paste', handlePaste);
        return () => document.removeEventListener('paste', handlePaste);
    }, []);

    const handleUploadImage = async (file: File) => {
        const fileValid = checkFile(file);
        if (!fileValid.isValid) {
            toast.error(fileValid.message);
        }

        setUploading(true);

        const reader = new FileReader();
        reader.onloadend = () => {
            setValue(name, reader.result as string, { shouldDirty: true });
        };
        reader.readAsDataURL(file);

        const formData = new FormData();
        formData.append('file', file);

        const { success, data, message } = await uploadImage(formData);

        if (success) {
            setValue(name, data.url, { shouldDirty: true });
            toast.success(message);
        } else {
            toast.error(message);
        }

        setUploading(false);
    };

    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Picture</FormLabel>

                    <FormControl>
                        <div className="flex flex-col items-center gap-2">
                            {uploading && (
                                <div className="flex items-center gap-1 text-xs text-blue-600">
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                    Uploading...
                                </div>
                            )}

                            {field.value ? (
                                <div className="relative group">
                                    <img src={field.value} className="w-20 h-20 rounded-lg border object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-lg"
                                    >
                                        <Upload className="text-white" size={18} />
                                    </button>
                                </div>
                            ) : (
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="h-20 w-full border-dashed"
                                >
                                    <Clipboard className="mr-2" size={18} />
                                    Click or Paste Image
                                </Button>
                            )}

                            <input
                                ref={fileInputRef}
                                type="file"
                                hidden
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) handleUploadImage(file);
                                }}
                            />
                        </div>
                    </FormControl>

                    <FormMessage />
                </FormItem>
            )}
        />
    );
}
