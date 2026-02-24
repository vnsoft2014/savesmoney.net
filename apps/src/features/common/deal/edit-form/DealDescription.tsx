'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import { useController, useFormContext } from 'react-hook-form';

import { Button } from '@/shared/shadecn/ui/button';
import { Field, FieldError, FieldLabel } from '@/shared/shadecn/ui/field';
import { Textarea } from '@/shared/shadecn/ui/textarea';

import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

export default function DealDescription() {
    const { control } = useFormContext();
    const [showHtml, setShowHtml] = useState(false);

    const { field, fieldState } = useController({
        name: 'description',
        control,
        rules: {
            required: 'Description is required',
        },
    });

    return (
        <Field data-invalid={fieldState.invalid} className="gap-2">
            <div className="flex items-center justify-between">
                <FieldLabel className="text-gray-700">
                    Description <span className="text-red-500">*</span>
                </FieldLabel>

                <Button type="button" variant="ghost" size="sm" onClick={() => setShowHtml((v) => !v)}>
                    {showHtml ? 'Visual Editor' : 'Show HTML'}
                </Button>
            </div>

            <div className="quill-wrapper">
                {showHtml ? (
                    <Textarea
                        rows={10}
                        value={field.value ?? ''}
                        onChange={(e) => field.onChange(e.target.value)}
                        className="font-mono text-sm"
                        aria-invalid={fieldState.invalid}
                    />
                ) : (
                    <ReactQuill
                        style={{ height: '350px' }}
                        theme="snow"
                        value={field.value || ''}
                        onChange={field.onChange}
                        placeholder="Enter deal description..."
                        className="quill-editor"
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
                )}

                {fieldState.invalid && <FieldError errors={[fieldState.error]} className="mt-14" />}
            </div>
        </Field>
    );
}
