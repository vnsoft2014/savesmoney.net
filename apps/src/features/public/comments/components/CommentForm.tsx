'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { Loader2, Send, Smile } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import * as z from 'zod';

import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/shared/shadecn/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/shared/shadecn/ui/card';
import { Field, FieldError } from '@/shared/shadecn/ui/field';
import { Input } from '@/shared/shadecn/ui/input';
import { Textarea } from '@/shared/shadecn/ui/textarea';
import { addComment } from '../services';

const formSchema = z.object({
    comment: z.string().min(1, 'Comment cannot be empty'),
    guestName: z.string().optional(),
    guestEmail: z.string().optional(),
});

type CommentFormValues = z.infer<typeof formSchema>;

type Props = {
    dealId: string;
    parentId?: string | null;
    onSuccess?: (comment: any) => void;
};

export default function CommentForm({ dealId, parentId = null, onSuccess }: Props) {
    const [showEmoji, setShowEmoji] = useState(false);
    const emojiPickerRef = useRef<HTMLDivElement | null>(null);
    const emojiButtonRef = useRef<HTMLButtonElement | null>(null);

    const { user, isSignin } = useAuth();

    const resolverSchema = useMemo(() => {
        return formSchema.superRefine((data, ctx) => {
            if (!isSignin) {
                if (!data.guestName || data.guestName.length < 2) {
                    ctx.addIssue({
                        code: 'custom',
                        path: ['guestName'],
                        message: 'Name is required',
                    });
                }

                if (!data.guestEmail) {
                    ctx.addIssue({
                        code: 'custom',
                        path: ['guestEmail'],
                        message: 'Email is required',
                    });
                } else if (!/^\S+@\S+\.\S+$/.test(data.guestEmail)) {
                    ctx.addIssue({
                        code: 'custom',
                        path: ['guestEmail'],
                        message: 'Invalid email address',
                    });
                }
            }
        });
    }, [isSignin]);

    const form = useForm<CommentFormValues>({
        resolver: zodResolver(resolverSchema),
        defaultValues: {
            comment: '',
            guestName: '',
            guestEmail: '',
        },
    });

    const {
        control,
        handleSubmit,
        setValue,
        getValues,
        setFocus,
        formState: { isSubmitting },
        reset,
    } = form;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                showEmoji &&
                emojiPickerRef.current &&
                !emojiPickerRef.current.contains(event.target as Node) &&
                !emojiButtonRef.current?.contains(event.target as Node)
            ) {
                setShowEmoji(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showEmoji]);

    const handleEmojiClick = (emojiData: EmojiClickData) => {
        const currentComment = getValues('comment');
        setValue('comment', currentComment + emojiData.emoji);
        setShowEmoji(false);
        setFocus('comment');
    };

    const onSubmit = async (values: CommentFormValues) => {
        const data = await addComment({
            dealId,
            content: values.comment,
            parentId,
            user,
            guestName: values.guestName,
            guestEmail: values.guestEmail,
        });

        if (data.success) {
            reset({ comment: '', guestName: '', guestEmail: '' });
            onSuccess?.(data.comment);
            toast.success(data.message);
        } else {
            toast.error(data.message);
        }
    };

    return (
        <Card className="border border-gray-100 shadow-xs">
            <CardHeader className="p-4 border-b">
                <CardTitle className="font-sans-condensed text-lg md:text-xl font-bold">Leave a Comment</CardTitle>
            </CardHeader>

            <form onSubmit={handleSubmit(onSubmit)}>
                <CardContent>
                    {!isSignin && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border-b">
                            <Controller
                                name="guestName"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <Input
                                            {...field}
                                            placeholder="Your name"
                                            className="h-10 px-3 text-sm border focus:ring-2 focus:ring-blue-500"
                                            aria-invalid={fieldState.invalid}
                                        />
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />

                            <Controller
                                name="guestEmail"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <Input
                                            {...field}
                                            type="email"
                                            placeholder="Your email"
                                            className="h-10 px-3 text-sm border focus:ring-2 focus:ring-blue-500"
                                            aria-invalid={fieldState.invalid}
                                        />
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                        </div>
                    )}

                    <div className="p-4">
                        <Controller
                            name="comment"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <Textarea
                                        {...field}
                                        placeholder="Share your thoughts..."
                                        className="w-full min-h-32 p-3 text-sm border resize-none focus:ring-2 focus:ring-blue-500"
                                        aria-invalid={fieldState.invalid}
                                    />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />
                    </div>
                </CardContent>

                <CardFooter className="relative flex justify-between items-center px-4 py-3 bg-gray-50 border-t">
                    <div className="relative">
                        <Button
                            variant="ghost"
                            size="sm"
                            ref={emojiButtonRef}
                            type="button"
                            onClick={() => setShowEmoji(!showEmoji)}
                        >
                            <Smile className="mr-2 h-4 w-4" />
                            Emoji
                        </Button>

                        {showEmoji && (
                            <div ref={emojiPickerRef} className="absolute bottom-full left-0 mb-2 z-50">
                                <EmojiPicker
                                    onEmojiClick={handleEmojiClick}
                                    height={350}
                                    width={300}
                                    previewConfig={{ showPreview: false }}
                                />
                            </div>
                        )}
                    </div>

                    <Button type="submit" disabled={isSubmitting} className="min-w-25 bg-blue-600 hover:bg-blue-700">
                        {isSubmitting ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <>
                                <Send className="mr-2 h-4 w-4" />
                                Send
                            </>
                        )}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}
