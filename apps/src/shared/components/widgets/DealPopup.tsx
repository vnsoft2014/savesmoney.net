'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { BellRing, CheckCircle2, Loader2, Mail, Sparkles, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { useAuth } from '@/hooks/useAuth';
import { checkDealSubscriber, subscribeDeal } from '@/services/common/subscribe';
import { Button } from '@/shared/shadecn/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/shadecn/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/shadecn/ui/form';
import { Input } from '@/shared/shadecn/ui/input';
import { toast } from 'react-toastify';

const POPUP_DELAY = 60000;
const COOLDOWN_TIME = 24 * 60 * 60 * 1000;
const STORAGE_KEY = 'deal_popup_closed_at';

const formSchema = z.object({
    name: z.string().min(1, 'Please enter your name'),
    email: z.string().min(1, 'Please enter your email').email('Please enter a valid email address'),
});

export default function DealPopup() {
    const { user, isSignin, isLoading: authLoading } = useAuth();

    const [showPopup, setShowPopup] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: user?.name || '',
            email: user?.email || '',
        },
    });

    useEffect(() => {
        if (isSignin && user) {
            form.reset({ name: user.name, email: user.email });
        }
    }, [isSignin, user, form]);

    useEffect(() => {
        if (authLoading) return;

        const closedAt = localStorage.getItem(STORAGE_KEY);
        if (closedAt && Date.now() - Number(closedAt) < COOLDOWN_TIME) return;

        const timer = setTimeout(async () => {
            const email = isSignin ? user?.email : '';
            if (!email) {
                setShowPopup(true);
                return;
            }

            try {
                const data = await checkDealSubscriber(email);
                if (!data.subscribed) setShowPopup(true);
            } catch {
                setShowPopup(true);
            }
        }, POPUP_DELAY);

        return () => clearTimeout(timer);
    }, [authLoading, isSignin, user?.email]);

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsLoading(true);
        try {
            const data = await subscribeDeal(values, user?._id, isSignin, 'popup');

            if (data.subscribed) {
                setSubmitted(true);
                localStorage.setItem(STORAGE_KEY, Date.now().toString());
            }

            setTimeout(() => setShowPopup(false), 5000);
        } catch (err: any) {
            toast.error(err.message || INTERNAL_SERVER);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        localStorage.setItem(STORAGE_KEY, Date.now().toString());
        setShowPopup(false);
    };

    return (
        <Dialog open={showPopup} onOpenChange={handleClose}>
            <DialogContent className="max-w-[calc(100%-2rem)] sm:max-w-md overflow-hidden p-0">
                <DialogTitle className="sr-only">Notify me of deals</DialogTitle>

                {!submitted ? (
                    <div className="p-6 sm:p-8">
                        <DialogHeader className="flex flex-col items-center text-center space-y-4 mb-4">
                            <div className="w-16 h-16 bg-indigo-300/10 rounded-2xl flex items-center justify-center text-primary ring-4 ring-primary/4">
                                <BellRing
                                    size={32}
                                    className="text-indigo-600 animate-bounce"
                                    style={{ animationIterationCount: 2 }}
                                />
                            </div>
                            <div className="space-y-2 text-center">
                                <h2 className="text-2xl font-extrabold tracking-tight">
                                    Don't Miss a Deal! <Sparkles className="inline-block text-yellow-400 w-5 h-5" />
                                </h2>
                                <p className="text-muted-foreground text-sm leading-relaxed">
                                    Join 5,000+ shoppers receiving exclusive offers directly in their inbox.
                                </p>
                            </div>
                        </DialogHeader>

                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem className="space-y-1">
                                            <FormLabel className="block mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">
                                                Full Name
                                            </FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                                                    <Input
                                                        {...field}
                                                        className="pl-10 h-12 text-sm"
                                                        placeholder="Enter your name"
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem className="space-y-1">
                                            <FormLabel className="block mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">
                                                Email Address
                                            </FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                                                    <Input
                                                        {...field}
                                                        className="pl-10 h-12 text-sm"
                                                        placeholder="name@company.com"
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )}
                                />

                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full h-12 text-base font-bold bg-indigo-600 hover:bg-indigo-700 mt-2"
                                >
                                    {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Notify Me of Deals'}
                                </Button>

                                <p className="text-center text-[10px] text-muted-foreground italic">
                                    We hate spam too. Unsubscribe at any time with one click.
                                </p>
                            </form>
                        </Form>
                    </div>
                ) : (
                    <div className="p-10 text-center animate-in fade-in zoom-in duration-300">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
                            <CheckCircle2 size={44} />
                        </div>
                        <h3 className="text-2xl font-bold mb-2">You're on the list!</h3>
                        <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                            Check your inbox soon for your first exclusive deal. Happy shopping!
                        </p>
                        <Button variant="link" onClick={handleClose} className="font-semibold text-blue-500">
                            Back to browsing
                        </Button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
