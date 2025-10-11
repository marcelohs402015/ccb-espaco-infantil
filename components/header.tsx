'use client';

import Image from 'next/image';
import { Heart } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
          <div className="bg-gradient-to-br from-amber-100 to-amber-50 rounded-xl p-2 shadow-xl border-2 border-amber-200">
            <Image 
              src="/ccb-logo.png" 
              alt="Congregação Cristã no Brasil" 
              width={200} 
              height={120}
              className="rounded-lg"
              priority
            />
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Heart className="w-6 h-6 fill-white" />
              <h1 className="text-2xl md:text-3xl font-bold">
                Espaço Infantil
              </h1>
              <Heart className="w-6 h-6 fill-white" />
            </div>
            <p className="text-sm md:text-base text-blue-100">
              Sistema de Gerenciamento
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

