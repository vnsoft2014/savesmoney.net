'use client';

import { X } from 'lucide-react';
import { useState } from 'react';
import { useController, useFormContext } from 'react-hook-form';

import { Badge } from '@/shared/shadecn/ui/badge';
import { Field, FieldError, FieldLabel } from '@/shared/shadecn/ui/field';
import { Input } from '@/shared/shadecn/ui/input';

export default function TagInput() {
    const { control } = useFormContext();

    const { field, fieldState } = useController({
        name: 'tags',
        control,
        defaultValue: [],
    });

    const [inputValue, setInputValue] = useState('');

    const tags: string[] = Array.isArray(field.value) ? field.value : [];

    const addTag = (tag: string) => {
        if (!tag) return;
        if (tags.includes(tag)) return;

        field.onChange([...tags, tag]);
    };

    const removeTag = (tag: string) => {
        field.onChange(tags.filter((t) => t !== tag));
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            addTag(inputValue.trim());
            setInputValue('');
        }
    };

    return (
        <Field data-invalid={fieldState.invalid} className="gap-2">
            <FieldLabel className="text-gray-700">Tags</FieldLabel>

            <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        <button type="button" onClick={() => removeTag(tag)} className="ml-1 rounded hover:bg-black/10">
                            <X className="h-3 w-3" />
                        </button>
                    </Badge>
                ))}
            </div>

            <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                aria-invalid={fieldState.invalid}
                placeholder="Enter tag and press Enter"
            />

            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
    );
}
