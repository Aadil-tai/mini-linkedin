/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'i.ibb.co',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'rwtuylaoqumluuovdlag.supabase.co',
                pathname: '/**',
            },
        ],
    },
    // Reduce development server logging
    logging: {
        fetches: {
            fullUrl: false,
        },
    },
    // Suppress warnings and reduce webpack logging
    webpack: (config, { dev, isServer }) => {
        if (dev) {
            config.infrastructureLogging = {
                level: 'error',
            };
        }
        return config;
    },
};

export default nextConfig;