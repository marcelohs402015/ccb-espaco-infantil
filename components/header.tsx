'use client';

import Image from 'next/image';
import { Heart, Sparkles } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-2xl relative overflow-hidden">
      {/* Decorative shapes */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-x-32 -translate-y-32"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl translate-x-32 translate-y-32"></div>
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
          <div className="bg-gradient-to-br from-yellow-200 via-amber-100 to-orange-100 rounded-3xl p-3 shadow-2xl border-4 border-yellow-300 transform hover:scale-105 transition-transform card-hover">
            <Image 
              src="/ccb-logo.png" 
              alt="Congregação Cristã no Brasil" 
              width={220} 
              height={132}
              className="rounded-2xl"
              priority
            />
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Sparkles className="w-8 h-8 fill-yellow-300 text-yellow-300 animate-pulse" />
              <Heart className="w-7 h-7 fill-pink-300 text-pink-300 animate-bounce-soft" />
              <h1 className="text-4xl md:text-5xl font-black drop-shadow-lg">
                ✨ Espaço Infantil Bíblico ✨
              </h1>
              <Heart className="w-7 h-7 fill-pink-300 text-pink-300 animate-bounce-soft" />
              <Sparkles className="w-8 h-8 fill-yellow-300 text-yellow-300 animate-pulse" />
            </div>
            <p className="text-lg md:text-xl text-white/90 font-semibold drop-shadow">
              🙏 Aplicação para auxílio das irmãs no espaço bíblico infantil 🙏
            </p>
          </div>
        </div>
      </div>
      
      {/* Bottom wave decoration */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100" className="w-full h-8 fill-white/10">
          <path d="M0,50 Q360,0 720,50 T1440,50 L1440,100 L0,100 Z"></path>
        </svg>
      </div>
    </header>
  );
};

