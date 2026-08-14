/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
      {
        source: '/retiros/inscripciones',
        destination: '/retreats/registration',
        permanent: true,
      },
      {
        source: '/retiros',
        destination: '/retreats',
        permanent: true,
      },
      {
        source: '/contacto',
        destination: '/contact',
        permanent: true,
      },
      {
        source: '/nosotros',
        destination: '/about',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
