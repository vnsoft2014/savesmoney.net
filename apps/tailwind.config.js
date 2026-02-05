/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./app/**/*.{js,ts,jsx,tsx}', './src/**/*.{js,ts,jsx,tsx,md,mdx}'],
    theme: {
        container: {
            center: true,
            screens: {
                xl: '96rem',
            },
        },
        extend: {
            fontFamily: {
                sans: ['var(--font-inter)'],
                helveticaCondensed: ['HelveticaNeueBoldCondensed', 'HelveticaNeueBoldCondensed_Fallback', 'sans-serif'],
            },
        },
    },
};
