/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./app/**/*.{js,ts,jsx,tsx}', './src/**/*.{js,ts,jsx,tsx,md,mdx}'],
    theme: {
        container: {
            center: true,
            screens: {
                '2xl': '96rem',
            },
        },
        extend: {
            fontFamily: {
                sans: ['HelveticaNeue', 'HelveticaNeue_Fallback'],
                'sans-condensed': ['HelveticaNeueBoldCondensed', 'HelveticaNeueBoldCondensed_Fallback'],
            },
        },
    },
};
