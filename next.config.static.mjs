import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./lib/i18n.ts');

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  trailingSlash: true,
  basePath,
  assetPrefix: basePath || undefined,
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

export default withNextIntl(nextConfig);
