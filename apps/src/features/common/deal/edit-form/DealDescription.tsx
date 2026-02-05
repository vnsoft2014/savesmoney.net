'use client';

import dynamic from 'next/dynamic';
import { useFormContext } from 'react-hook-form';

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/shadecn/ui/form';

import { Button } from '@/shared/shadecn/ui/button';
import { Textarea } from '@/shared/shadecn/ui/textarea';
import { useState } from 'react';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

export default function DealDescription() {
    const { control } = useFormContext();

    const [showHtml, setShowHtml] = useState(false);

    return (
        <FormField
            control={control}
            name="description"
            render={({ field }) => (
                <FormItem>
                    <div className="flex items-center justify-between">
                        <FormLabel>
                            Description <span className="text-red-500">*</span>
                        </FormLabel>

                        <Button type="button" variant="ghost" size="sm" onClick={() => setShowHtml((v) => !v)}>
                            {showHtml ? 'Visual Editor' : 'Show HTML'}
                        </Button>
                    </div>

                    <div className="quill-wrapper">
                        <FormControl>
                            {showHtml ? (
                                <Textarea
                                    rows={10}
                                    value={field.value ?? ''}
                                    onChange={(e) => field.onChange(e.target.value)}
                                    className="font-mono text-sm"
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
                        </FormControl>
                    </div>

                    <FormMessage className="mt-14" />
                </FormItem>
            )}
        />
    );
}
