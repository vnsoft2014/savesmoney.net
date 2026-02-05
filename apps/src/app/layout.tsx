import Providers from '@/store/Providers';

import { cn } from '@/lib/utils';
import { getSettings } from '@/services/admin/settings';
import { SettingsForm } from '@/types/settings';
import { buildSeoMetadata } from '@/utils/seo';
import { SITE } from '@/utils/site';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import NextTopLoader from 'nextjs-toploader';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './global.css';

const inter = Inter({
    subsets: ['latin', 'vietnamese'],
    variable: '--font-inter',
    display: 'swap',
});

export interface LayoutProps {
    children: React.ReactNode;
}

export async function generateMetadata() {
    const settings = (await getSettings()) as SettingsForm | undefined;

    return buildSeoMetadata({
        title: settings?.websiteTitle || SITE.title,
        description: settings?.websiteDescription || SITE.description,
        url: SITE.url || 'https://savesmoney.net',
        image: settings?.logo || `${SITE.url}/logo.png`,
        favicon: settings?.favicon ? `${SITE.url}/${settings.favicon}` : `${SITE.url}/favicon.ico`,
    });
}

export default function RootLayout({ children }: LayoutProps) {
    return (
        <html lang="en" className={cn('motion-safe:scroll-smooth', inter.variable, 'font-sans')}>
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="google-adsense-account" content="ca-pub-7598560907189118" />

                {/* Google tag (gtag.js) */}
                <Script src="https://www.googletagmanager.com/gtag/js?id=G-HQ4LQHEHWC" strategy="afterInteractive" />
                <Script id="google-analytics" strategy="afterInteractive">
                    {`
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                        gtag('config', 'G-HQ4LQHEHWC');
                    `}
                </Script>

                <script
                    async
                    src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7598560907189118"
                    crossOrigin="anonymous"
                />
            </head>
            <body className="tracking-tight antialiased text-gray-900">
                <Providers>
                    <NextTopLoader
                        color="#8cc644"
                        initialPosition={0.08}
                        crawlSpeed={200}
                        height={3}
                        crawl={true}
                        showSpinner={true}
                        easing="ease"
                        speed={200}
                        shadow="0 0 10px #8cc644,0 0 5px #8cc644"
                        template='<div class="bar" role="bar"><div class="peg"></div></div>'
                        zIndex={1600}
                        showAtBottom={false}
                    />
                    {children}
                </Providers>
                <ToastContainer autoClose={1500} />
            </body>
        </html>
    );
}
