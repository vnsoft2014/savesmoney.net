'use client';

import { useEffect } from 'react';

type AdsProps = {
    slot: string;
    format?: 'auto' | 'fluid';
    responsive?: boolean;
    className?: string;
};

const ADS_CLIENT = 'ca-pub-7598560907189118';

export default function Ads({ slot, format = 'auto', responsive = true, className = '' }: AdsProps) {
    useEffect(() => {
        try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (e) {
            console.error('Adsense error', e);
        }
    }, []);

    return (
        <div className="py-4 h-20 hidden">
            ADS
            {
                // <ins
                //   className={`adsbygoogle ${className}`}
                //   style={{ display: 'block' }}
                //   data-ad-client={ADS_CLIENT}
                //   data-ad-slot={slot}
                //   data-ad-format={format}
                //   data-full-width-responsive={responsive.toString()}
                // />
            }
        </div>
    );
}
