'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/shared/shadecn/ui/button';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/shared/shadecn/ui/form';
import { Input } from '@/shared/shadecn/ui/input';
import { Textarea } from '@/shared/shadecn/ui/textarea';

// Schema validation với Zod
const formSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    shopUrl: z.string().min(1, 'URL is required'),
    bio: z.string().max(160).optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function CreateShopSettings() {
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            shopUrl: '',
            bio: '',
        },
    });

    const onSubmit = (values: FormValues) => {
        console.log(values);
    };

    return (
        <div className="min-h-screen max-w-md bg-white p-6">
            <h1 className="mb-6 text-2xl font-bold text-slate-900">Settings</h1>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    {/* Photo */}
                    {/* <div className="space-y-3">
                        <FormLabel className="text-sm font-semibold">Photo</FormLabel>

                        <Card className="border-none bg-slate-50/50 shadow-none">
                            <CardContent className="flex items-center gap-4 pt-6">
                                <div className="h-20 w-20 rounded-full bg-slate-200" />

                                <div className="flex flex-col gap-2">
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        className="w-32 bg-blue-50 text-blue-600 hover:bg-blue-100"
                                    >
                                        Add photo
                                    </Button>

                                    <Button
                                        type="button"
                                        variant="secondary"
                                        className="w-32 bg-blue-50 text-blue-600 hover:bg-blue-100"
                                    >
                                        Clear photo
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div> */}

                    {/* Name */}
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="font-semibold">Name</FormLabel>

                                <FormControl>
                                    <Input
                                        {...field}
                                        placeholder="Enter shop name"
                                        className="border-none bg-slate-50 focus-visible:ring-1"
                                    />
                                </FormControl>

                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* URL */}
                    <FormField
                        control={form.control}
                        name="shopUrl"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="font-semibold">URL</FormLabel>

                                <FormControl>
                                    <div className="flex overflow-hidden rounded-md">
                                        <span className="inline-flex items-center border-r border-slate-200 bg-slate-50 px-3 text-sm text-blue-500">
                                            https://mave.ly/
                                        </span>

                                        <Input
                                            {...field}
                                            placeholder="your-shop-url"
                                            className="rounded-l-none border-none bg-slate-50 focus-visible:ring-1"
                                        />
                                    </div>
                                </FormControl>

                                <FormDescription className="pt-1 text-xs italic text-slate-500">
                                    Warning: Your shop url is locked after shop creation for SEO optimization reasons.
                                    If you need to change your url after creating your shop, you will need to submit a
                                    help ticket.
                                </FormDescription>

                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Bio */}
                    <FormField
                        control={form.control}
                        name="bio"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="font-semibold">Bio</FormLabel>

                                <FormControl>
                                    <Textarea
                                        {...field}
                                        className="min-h-[100px] resize-none border-none bg-slate-50 focus-visible:ring-1"
                                    />
                                </FormControl>

                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Socials */}
                    {/* <div className="space-y-2">
                        <FormLabel className="font-semibold text-slate-900">Socials</FormLabel>
                        <p className="text-sm italic text-slate-500">
                            Coming soon! This feature is under development. In the meantime, you can use the Mavely
                            mobile app to add your socials to your MyShop.
                        </p>
                    </div> */}

                    {/* Actions */}
                    <div className="flex gap-3 rounded-lg bg-slate-50 p-4 pt-4">
                        <Button type="button" variant="outline" className="flex-1 bg-white">
                            Cancel
                        </Button>

                        <Button type="submit" className="flex-1 bg-indigo-600 hover:bg-indigo-700">
                            Create Shop
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
