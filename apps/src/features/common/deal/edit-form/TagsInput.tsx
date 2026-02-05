'use client';

import { X } from 'lucide-react';
import { useState } from 'react';
import { useController, useFormContext } from 'react-hook-form';

import { Badge } from '@/shared/shadecn/ui/badge';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/shared/shadecn/ui/form';
import { Input } from '@/shared/shadecn/ui/input';

export default function TagInput() {
    const { control } = useFormContext();

    const {
        field: { value = [], onChange },
    } = useController({
        name: 'tags',
        control,
    });

    const [inputValue, setInputValue] = useState('');

    const tags: string[] = Array.isArray(value) ? value : [];

    const addTag = (tag: string) => {
        if (!tag) return;
        if (tags.includes(tag)) return;

        onChange([...tags, tag]);
    };

    const removeTag = (tag: string) => {
        onChange(tags.filter((t) => t !== tag));
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            addTag(inputValue.trim());
            setInputValue('');
        }
    };

    return (
        <FormField
            control={control}
            name="tags"
            render={() => (
                <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <FormControl>
                        <div className="space-y-2">
                            <div className="flex flex-wrap gap-2">
                                {tags.map((tag) => (
                                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                                        {tag}
                                        <button
                                            type="button"
                                            onClick={() => removeTag(tag)}
                                            className="ml-1 rounded hover:bg-black/10"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </Badge>
                                ))}
                            </div>

                            <Input
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Enter tag and press Enter"
                            />
                        </div>
                    </FormControl>
                    <FormDescription>Press Enter or comma to add a tag</FormDescription>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}
