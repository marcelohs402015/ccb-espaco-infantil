'use client';

import { useState, useMemo } from 'react';
import { Church, ChevronDown, Search } from 'lucide-react';
import { useSpaceStore } from '@/store/use-space-store';

export const ChurchSelector: React.FC = () => {
  const { igrejas, igrejaAtiva, setIgrejaAtiva } = useSpaceStore();
  const [searchTerm, setSearchTerm] = useState('');

  const igrejaAtualNome = igrejas.find(i => i.id === igrejaAtiva)?.nome || 'Selecione uma igreja';

  // Função para normalizar texto (remover acentos e espaços)
  const normalizeText = (text: string): string => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove acentos
      .replace(/\s+/g, ''); // Remove espaços
  };

  // Filtrar igrejas baseado no termo de busca
  const igrejasFiltradas = useMemo(() => {
    if (!searchTerm.trim()) return igrejas;
    
    const searchNormalized = normalizeText(searchTerm);
    
    return igrejas.filter(igreja => {
      const nomeNormalized = normalizeText(igreja.nome);
      const idNormalized = normalizeText(igreja.id);
      
      return nomeNormalized.includes(searchNormalized) || 
             idNormalized.includes(searchNormalized);
    });
  }, [igrejas, searchTerm]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(e.target.value);
  };

  const handleClearSearch = (): void => {
    setSearchTerm('');
  };

  const handleOpenChurches = (): void => {
    // Disparar evento para abrir modal de igrejas
    window.dispatchEvent(new CustomEvent('openChurchesModal'));
  };

  if (igrejas.length === 0) {
    return (
      <div className="bg-yellow-100 border-2 border-yellow-400 rounded-xl p-6 mb-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Church className="w-6 h-6 text-yellow-700" />
            <div>
              <p className="font-bold text-yellow-800">Nenhuma igreja cadastrada</p>
              <p className="text-sm text-yellow-700">
                Clique no botão ao lado para cadastrar a primeira igreja.
              </p>
            </div>
          </div>
          <button
            onClick={handleOpenChurches}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center gap-2 whitespace-nowrap"
          >
            <Church className="w-5 h-5" />
            Cadastrar Igreja
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 mb-6 border-2 border-blue-200 shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-4 flex-1">
          <label htmlFor="igreja-select" className="block text-sm font-bold text-gray-700">
            <div className="flex items-center gap-2">
              <Church className="w-5 h-5 text-blue-600" />
              Selecione a Igreja para Gerenciar:
            </div>
          </label>
          
          {/* Campo de busca */}
          <div className="relative flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar igreja..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-sm text-gray-900"
              />
              {searchTerm && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Limpar busca"
                >
                  ×
                </button>
              )}
            </div>
          </div>
        </div>
        
        <button
          onClick={handleOpenChurches}
          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white text-sm font-semibold rounded-lg transition-all shadow-md hover:shadow-lg flex items-center gap-2 whitespace-nowrap"
        >
          <Church className="w-4 h-4" />
          Cadastrar nova Igreja
        </button>
      </div>
      
      <div className="relative">
        <select
          id="igreja-select"
          value={igrejaAtiva || ''}
          onChange={(e) => setIgrejaAtiva(e.target.value || null)}
          className="w-full px-4 py-3 pr-10 border-2 border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-gray-900 font-semibold bg-white appearance-none cursor-pointer"
        >
          <option value="">Selecione uma igreja...</option>
          {igrejasFiltradas.map((igreja) => (
            <option key={igreja.id} value={igreja.id}>
              {igreja.nome}
            </option>
          ))}
          {/* Se a igreja ativa não está na lista filtrada, mas existe, mostra ela */}
          {igrejaAtiva && !igrejasFiltradas.find(i => i.id === igrejaAtiva) && (
            <option value={igrejaAtiva} style={{ backgroundColor: '#e0f2fe' }}>
              {igrejaAtualNome} (selecionada)
            </option>
          )}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <ChevronDown className="w-5 h-5 text-gray-500" />
        </div>
      </div>

      {/* Mensagem quando não há resultados na busca */}
      {searchTerm && igrejasFiltradas.length === 0 && (
        <div className="mt-2 p-3 bg-yellow-100 border border-yellow-300 rounded-lg">
          <p className="text-sm text-yellow-800">
            Nenhuma igreja encontrada para "{searchTerm}". 
            <button
              onClick={handleClearSearch}
              className="ml-1 text-yellow-700 underline hover:text-yellow-900"
            >
              Limpar busca
            </button>
          </p>
        </div>
      )}

      {igrejaAtiva && (
        <div className="mt-3 p-3 bg-green-100 border border-green-300 rounded-lg">
          <p className="text-sm text-green-800">
            ✅ <span className="font-bold">Igreja ativa:</span> {igrejaAtualNome}
          </p>
          <p className="text-xs text-green-700 mt-1">
            Todos os dados (crianças, cultos, histórico) serão específicos desta igreja.
          </p>
        </div>
      )}
    </div>
  );
};

