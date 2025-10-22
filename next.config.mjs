/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Otimizações para o Vercel
  swcMinify: true,
  poweredByHeader: false,
  
  // Otimizações de compilação para Vercel
  experimental: {
    serverComponentsExternalPackages: ['@supabase/supabase-js'],
    // Otimização de bundle para Vercel
    optimizePackageImports: ['lucide-react'],
  },

  // Remover output standalone - Vercel gerencia isso automaticamente
  // output: 'standalone',
  
  // Configuração para Vercel Edge Runtime (se necessário)
  // runtime: 'edge', // Descomente apenas se usar Edge Functions

  // Configuração para PWA
  async headers() {
    return [
      {
        source: '/sw.js',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
          {
            key: 'Service-Worker-Allowed',
            value: '/',
          },
        ],
      },
      {
        source: '/manifest.json',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;

