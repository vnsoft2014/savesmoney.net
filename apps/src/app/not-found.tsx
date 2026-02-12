import { Footer, Header } from '@/features/public/layout';
import Link from 'next/link';

export default function NotFound() {
    return (
        <>
            <Header />
            <main>
                <div className="flex flex-col items-center justify-center min-h-[calc(100vh-140px)] lg:min-h-[calc(100vh-180px)] md:min-h-[calc(100vh-229px)] text-gray-800 p-4">
                    <h1 className="text-3xl md:text-6xl font-bold mb-4">404</h1>
                    <p className="text-center text-sm md:text-lg mb-6">
                        Oops! The page you are looking for does not exist.
                    </p>
                    <Link
                        href="/"
                        className="px-6 py-2 md:py-3 text-sm md:text-base bg-orange-500 text-white rounded-full hover:bg-orange-600 transition"
                    >
                        Go back home
                    </Link>
                </div>
            </main>
            <Footer />
        </>
    );
}
