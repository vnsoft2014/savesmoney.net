import { Button } from '@/shared/shadecn/ui/button';
import { Loader2 } from 'lucide-react';
import { signIn } from 'next-auth/react';
import { useState } from 'react';

const SocialButton = ({ provider, icon, onClick, loading }: any) => (
    <Button
        variant="outline"
        className="w-full h-12 transition-all hover:bg-gray-50 flex items-center justify-center"
        onClick={onClick}
        disabled={!!loading}
    >
        {loading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
            <img src={icon} alt={provider} className="h-5 w-5 object-contain" />
        )}
    </Button>
);

const SocialAuthButtons = () => {
    const [isLoading, setIsLoading] = useState<string | null>(null);

    const handleSocialLogin = async (provider: string) => {
        setIsLoading(provider);
        await signIn(provider);
        setIsLoading(null);
    };

    return (
        <div className="mt-4 space-y-6 w-full">
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-4 font-bold text-muted-foreground">Or continue with</span>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
                <SocialButton
                    provider="google"
                    icon="/icons/google.svg"
                    loading={isLoading === 'google'}
                    onClick={() => handleSocialLogin('google')}
                />
                <SocialButton
                    provider="facebook"
                    icon="/icons/facebook.svg"
                    loading={isLoading === 'facebook'}
                    onClick={() => handleSocialLogin('facebook')}
                />
            </div>
        </div>
    );
};

export default SocialAuthButtons;
