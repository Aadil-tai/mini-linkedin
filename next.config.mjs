/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: [
            'lh3.googleusercontent.com', // Google user avatars
            'i.ibb.co',      // Example: add other domains you use
            'rwtuylaoqumluuovdlag.supabase.co' // If using Supabase Storage
        ],
    },
};

export default nextConfig;

