'use client';

import { TailSpin } from 'react-loader-spinner';

export default function Loading() {
    return (
        <div className="w-full h-full flex items-center justify-center">
            <TailSpin height="50" width="50" color="blue" ariaLabel="tail-spin-loading" radius="1" visible={true} />
        </div>
    );
}
