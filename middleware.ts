import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Durante o build, evitar processamento de rotas dinâmicas específicas
  if (process.env.NODE_ENV === 'development' || process.env.VERCEL_ENV) {
    const pathname = request.nextUrl.pathname;
    
    // Se for uma rota de emergência sem ID válido, retornar erro apropriado
    if (pathname.includes('/api/children/') && pathname.includes('/emergencia')) {
      const idMatch = pathname.match(/\/api\/children\/([^\/]+)\/emergencia/);
      if (idMatch && (idMatch[1] === '[id]' || !idMatch[1] || idMatch[1] === 'undefined')) {
        return NextResponse.json(
          { error: 'ID da criança é obrigatório' },
          { status: 400 }
        );
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/api/children/:path*/emergencia',
  ],
};