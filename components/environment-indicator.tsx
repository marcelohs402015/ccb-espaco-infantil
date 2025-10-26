'use client';

/**
 * Environment Indicator Component
 * Displays a visual badge when the app is running in staging/development environment
 */
export const EnvironmentIndicator: React.FC = () => {
  const env = process.env.NEXT_PUBLIC_ENV || 'production';
  
  // Hide indicator in production
  if (env === 'production') return null;
  
  return (
    <div className="fixed bottom-4 right-4 bg-yellow-500 text-black px-4 py-2 rounded-lg shadow-lg font-bold z-50 animate-pulse">
      🚧 AMBIENTE DE TESTE
    </div>
  );
};

