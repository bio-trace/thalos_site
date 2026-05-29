import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./lib/i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: { formats: ['image/avif', 'image/webp'] },
  async rewrites() {
    return [
      // Sveltia CMS lives in public/admin/index.html. Next does not auto-serve
      // index.html for directory requests, so rewrite /admin and /admin/ to it.
      { source: '/admin', destination: '/admin/index.html' },
      { source: '/admin/', destination: '/admin/index.html' },
    ];
  },
};

export default withNextIntl(nextConfig);
