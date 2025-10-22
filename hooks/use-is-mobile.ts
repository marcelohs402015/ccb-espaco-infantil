/**
 * Hook para detectar se o dispositivo é mobile
 * CCB Espaço Infantil
 */

'use client';

import { useState, useEffect } from 'react';

/**
 * Hook que detecta se o dispositivo é mobile
 * 
 * Considera mobile:
 * - Telas com largura menor ou igual a 768px (breakpoint md do Tailwind)
 * - User agent contendo indicadores de dispositivos móveis
 * 
 * @returns true se for mobile, false caso contrário
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = (): boolean => {
      if (typeof window === 'undefined') return false;

      // Verifica largura da tela (768px é o breakpoint md do Tailwind)
      const isSmallScreen = window.innerWidth <= 768;

      // Verifica user agent para dispositivos móveis
      const userAgent = navigator.userAgent.toLowerCase();
      const mobileKeywords = ['android', 'webos', 'iphone', 'ipad', 'ipod', 'blackberry', 'windows phone'];
      const hasMobileUserAgent = mobileKeywords.some(keyword => userAgent.includes(keyword));

      // Verifica se possui touch screen (indicador adicional de mobile)
      const hasTouchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

      // Considera mobile se tela pequena OU se user agent indicar mobile com touch
      return isSmallScreen || (hasMobileUserAgent && hasTouchScreen);
    };

    // Verificação inicial
    setIsMobile(checkIsMobile());

    // Listener para mudanças no tamanho da tela
    const handleResize = (): void => {
      setIsMobile(checkIsMobile());
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return isMobile;
}
