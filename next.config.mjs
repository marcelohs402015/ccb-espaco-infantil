/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Configuração para as rotas da API
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, max-age=0',
          },
        ],
      },
    ];
  },
  
  // Otimizações para o Vercel
  swcMinify: true,
  poweredByHeader: false,
  
  // Configuração específica para evitar problemas de build no Vercel
  generateBuildId: async () => {
    // Use um build ID único para cada deploy
    return `build-${Date.now()}`;
  },
  
  // Configuração experimental para melhor compatibilidade com Vercel
  experimental: {
    serverComponentsExternalPackages: ['@supabase/supabase-js'],
  },
};

export default nextConfig;

