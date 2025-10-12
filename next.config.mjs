/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Otimizações para o Vercel
  swcMinify: true,
  poweredByHeader: false,
  
  // Configuração experimental para melhor compatibilidade com Vercel
  experimental: {
    serverComponentsExternalPackages: ['@supabase/supabase-js'],
  },
};

export default nextConfig;

