'use client';

import { ImagePlus } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useController, useFormContext } from 'react-hook-form';

import { MESSAGES } from '@/config/messages';
import { Field, FieldError, FieldLabel } from '@/shared/shadecn/ui/field';
import { Input } from '@/shared/shadecn/ui/input';
import Image from 'next/image';

type Props = {
    thumbnail?: string;
};

export default function PictureUploadField({ thumbnail }: Props) {
    const { control } = useFormContext();

    const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(thumbnail || null);

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const { field, fieldState } = useController({
        name: 'picture',
        control,
    });

    useEffect(() => {
        const handlePaste = (e: ClipboardEvent) => {
            const items = e.clipboardData?.items;
            if (!items) return;

            for (const item of items) {
                if (item.type.startsWith('image')) {
                    e.preventDefault();

                    const file = item.getAsFile();
                    if (!file || !fileInputRef.current) return;

                    const dataTransfer = new DataTransfer();
                    dataTransfer.items.add(file);

                    fileInputRef.current.files = dataTransfer.files;

                    fileInputRef.current.dispatchEvent(new Event('change', { bubbles: true }));

                    break;
                }
            }
        };

        document.addEventListener('paste', handlePaste);
        return () => document.removeEventListener('paste', handlePaste);
    }, []);

    return (
        <Field className="gap-2" data-invalid={fieldState.invalid}>
            <FieldLabel className="justify-center text-gray-700">
                Thumbnail <span className="text-red-500">*</span>
            </FieldLabel>

            <div className="flex justify-center">
                <label className="flex cursor-pointer">
                    <div className="w-28 h-28 rounded-2xl border-2 border-dashed border-gray-300 flex items-center justify-center hover:border-indigo-500 transition">
                        {thumbnailPreview ? (
                            <Image
                                src={thumbnailPreview}
                                alt="LogoPreview"
                                width={112}
                                height={112}
                                className="w-full h-full object-cover rounded-2xl"
                            />
                        ) : (
                            <ImagePlus className="w-6 h-6 text-gray-400" />
                        )}
                    </div>

                    <Input
                        type="file"
                        accept="image/*"
                        ref={(el) => {
                            field.ref(el);
                            fileInputRef.current = el;
                        }}
                        className="w-0 p-0 opacity-0"
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                                field.onChange(file);

                                const url = URL.createObjectURL(file);

                                setThumbnailPreview((prev) => {
                                    if (prev?.startsWith('blob:')) {
                                        URL.revokeObjectURL(prev);
                                    }
                                    return url;
                                });
                            }
                        }}
                    />
                </label>
            </div>

            <div className="text-center text-xs italic text-muted-foreground">(Click or Paste)</div>
            <div className="text-center text-xs text-muted-foreground">{MESSAGES.IMAGE.REQUIREMENTS_5000}</div>

            {fieldState.invalid && <FieldError className="text-center" errors={[fieldState.error]} />}
        </Field>
    );
}
