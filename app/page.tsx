'use client';

import { useState } from 'react';
import { Plus, Settings, Users, BookOpen, Edit } from 'lucide-react';
import { useSpaceStore } from '@/store/use-space-store';
import { Header } from '@/components/header';
import { ChildCard } from '@/components/child-card';
import { AddChildForm } from '@/components/add-child-form';
import { SettingsModal } from '@/components/settings-modal';
import { ObservationsModal } from '@/components/observations-modal';
import type { Child } from '@/types';

export default function Home() {
  const { children, settings, cultoObservacoes, addChild, updateChild, removeChild, updateSettings, updateCultoObservacoes } = useSpaceStore();
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isObservationsOpen, setIsObservationsOpen] = useState(false);
  const [childToEdit, setChildToEdit] = useState<Child | null>(null);

  const capacidadeAtual = children.length;
  const capacidadeMaxima = settings.capacidadeMaxima;
  const percentualOcupacao = (capacidadeAtual / capacidadeMaxima) * 100;

  const getCapacidadeColor = (): string => {
    if (percentualOcupacao >= 90) return 'text-red-600';
    if (percentualOcupacao >= 70) return 'text-yellow-600';
    return 'text-green-600';
  };

  const handleEditChild = (child: Child): void => {
    setChildToEdit(child);
    setIsAddFormOpen(true);
  };

  const handleSaveChild = (child: Child): void => {
    if (childToEdit) {
      updateChild(child.id, child);
    } else {
      addChild(child);
    }
  };

  const handleCloseForm = (): void => {
    setIsAddFormOpen(false);
    setChildToEdit(null);
  };

  const handleAddNewChild = (): void => {
    setChildToEdit(null);
    setIsAddFormOpen(true);
  };

  return (
    <main className="min-h-screen">
      <Header />
      
      <div className="container mx-auto px-4 py-8 relative">
        {/* Capacity Status */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8 border-4 border-purple-200 card-hover backdrop-blur-sm bg-opacity-95">
          <div className="flex items-center justify-between flex-wrap gap-6">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-4 rounded-2xl shadow-lg animate-bounce-soft">
                <Users className="w-10 h-10 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                  Capacidade do Espaço
                </h2>
                <p className="text-base text-gray-600 font-medium">
                  🎈 Crianças presentes no momento
                </p>
              </div>
            </div>
            
            <div className="text-center bg-gradient-to-br from-purple-50 to-pink-50 px-8 py-4 rounded-2xl border-2 border-purple-200">
              <p className={`text-6xl font-black ${getCapacidadeColor()} drop-shadow-lg`}>
                {capacidadeAtual} / {capacidadeMaxima}
              </p>
              <p className="text-base text-gray-700 mt-2 font-semibold">
                {percentualOcupacao.toFixed(0)}% ocupado
              </p>
            </div>

            <button
              onClick={() => setIsSettingsOpen(true)}
              className="px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-black text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-2xl button-pop flex items-center gap-2"
              aria-label="Configurações"
            >
              <Settings className="w-6 h-6" />
              Configurar
            </button>
          </div>
        </div>

        {/* Worship Summary */}
        {cultoObservacoes && (cultoObservacoes.palavraLida || cultoObservacoes.hinosCantados || cultoObservacoes.aprendizado) && (
          <div className="bg-gradient-to-r from-green-100 to-teal-100 rounded-xl shadow-lg p-6 mb-8 border-2 border-green-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-green-700" />
                <h3 className="text-xl font-bold text-gray-900">Resumo do Culto</h3>
              </div>
              <button
                onClick={() => setIsObservationsOpen(true)}
                className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Alterar
              </button>
            </div>
            
            <div className="grid md:grid-cols-3 gap-4">
              {cultoObservacoes.palavraLida && (
                <div>
                  <p className="text-xs font-bold text-green-700 uppercase mb-1">Palavra Lida</p>
                  <p className="text-sm text-gray-800 bg-white p-2 rounded border border-green-200">
                    {cultoObservacoes.palavraLida}
                  </p>
                </div>
              )}
              {cultoObservacoes.hinosCantados && (
                <div>
                  <p className="text-xs font-bold text-green-700 uppercase mb-1">Hinos Cantados</p>
                  <p className="text-sm text-gray-800 bg-white p-2 rounded border border-green-200">
                    {cultoObservacoes.hinosCantados}
                  </p>
                </div>
              )}
              {cultoObservacoes.aprendizado && (
                <div>
                  <p className="text-xs font-bold text-green-700 uppercase mb-1">Aprendizado</p>
                  <p className="text-sm text-gray-800 bg-white p-2 rounded border border-green-200">
                    {cultoObservacoes.aprendizado}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-6 mb-8">
          <button
            onClick={handleAddNewChild}
            className="flex-1 min-w-[280px] px-8 py-6 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-black text-xl rounded-2xl hover:scale-105 transition-all shadow-2xl hover:shadow-purple-500/50 button-pop flex items-center justify-center gap-3 border-4 border-white/30 relative overflow-hidden group"
          >
            <div className="absolute inset-0 gradient-shine"></div>
            <Plus className="w-8 h-8 group-hover:rotate-90 transition-transform" />
            <span className="relative z-10">✨ Nova Criança</span>
          </button>
          
          <button
            onClick={() => setIsObservationsOpen(true)}
            className="flex-1 min-w-[280px] px-8 py-6 bg-gradient-to-r from-green-500 via-teal-500 to-cyan-500 text-white font-black text-xl rounded-2xl hover:scale-105 transition-all shadow-2xl hover:shadow-green-500/50 button-pop flex items-center justify-center gap-3 border-4 border-white/30 relative overflow-hidden group"
          >
            <div className="absolute inset-0 gradient-shine"></div>
            <BookOpen className="w-8 h-8 group-hover:rotate-12 transition-transform" />
            <span className="relative z-10">📖 Sobre o Culto</span>
          </button>
        </div>

        {/* Children Grid */}
        {children.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-2xl p-16 text-center border-4 border-dashed border-purple-300 card-hover backdrop-blur-sm bg-opacity-95">
            <div className="animate-float mb-6">
              <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-full p-8 inline-block">
                <Users className="w-24 h-24 text-purple-400 mx-auto" />
              </div>
            </div>
            <h3 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-3">
              👶 Nenhuma criança cadastrada ainda
            </h3>
            <p className="text-gray-600 text-lg mb-8 font-medium">
              🎈 Clique no botão abaixo para adicionar a primeira criança
            </p>
            <button
              onClick={handleAddNewChild}
              className="px-10 py-5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-black text-xl rounded-2xl hover:scale-110 transition-all shadow-2xl hover:shadow-purple-500/50 button-pop inline-flex items-center gap-3 border-4 border-white/30 relative overflow-hidden group"
            >
              <div className="absolute inset-0 gradient-shine"></div>
              <Plus className="w-7 h-7 group-hover:rotate-180 transition-transform" />
              <span className="relative z-10">Adicionar Primeira Criança</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {children.map((child) => (
              <ChildCard
                key={child.id}
                child={child}
                onRemove={removeChild}
                onEdit={handleEditChild}
              />
            ))}
          </div>
        )}
      </div>

      {isAddFormOpen && (
        <AddChildForm
          onAdd={handleSaveChild}
          onClose={handleCloseForm}
          childToEdit={childToEdit}
        />
      )}

      {isSettingsOpen && (
        <SettingsModal
          settings={settings}
          onUpdate={updateSettings}
          onClose={() => setIsSettingsOpen(false)}
        />
      )}

      {isObservationsOpen && (
        <ObservationsModal
          observacoes={cultoObservacoes}
          onUpdate={updateCultoObservacoes}
          onClose={() => setIsObservationsOpen(false)}
        />
      )}
    </main>
  );
}

