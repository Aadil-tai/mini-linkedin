/** @type {import('next').NextConfig} */
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
                // image db This is the domain allowed to serve images. i.ibb.co is a popular image hosting service (part of imgbb.com) used to store and serve images.
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'rwtuylaoqumluuovdlag.supabase.co',
                pathname: '/**',
            },
        ],
    },
    // Performance optimizations for development
    swcMinify: true,
    reactStrictMode: true,

    // Reduce development server logging
    logging: {
        fetches: {
            fullUrl: false,
        },
    },

    // Performance optimizations
    experimental: {
        optimizePackageImports: [
            '@tiptap/react',
            '@tiptap/starter-kit',
            '@tiptap/extension-placeholder',
            '@tiptap/extension-link',
            '@tiptap/extension-image',
            'lucide-react',
            '@hookform/resolvers',
            'react-hook-form'
        ],
    },

    // Webpack optimizations
    webpack: (config, { dev, isServer }) => {
        // Reduce logging in development
        config.infrastructureLogging = {
            level: dev ? 'error' : 'warn',
        };

        if (dev) {
            // Optimize development builds only
            config.optimization.splitChunks = {
                chunks: 'all',
                cacheGroups: {
                    vendor: {
                        test: /[\\/]node_modules[\\/]/,
                        name: 'vendors',
                        chunks: 'all',
                        priority: 10,
                    },
                    tiptap: {
                        test: /[\\/]node_modules[\\/]@tiptap[\\/]/,
                        name: 'tiptap',
                        chunks: 'all',
                        priority: 20,
                    },
                    react: {
                        test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
                        name: 'react',
                        chunks: 'all',
                        priority: 30,
                    },
                },
            };

            // Reduce module resolution time
            config.resolve.alias = {
                ...config.resolve.alias,
                '@': path.resolve(__dirname, 'src'),
            };
        }

        return config;
    },
};

export default nextConfig;