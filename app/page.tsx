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
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Capacity Status */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border-2 border-gray-100">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-purple-600" />
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Capacidade do Espaço
                </h2>
                <p className="text-sm text-gray-600">
                  Crianças presentes no momento
                </p>
              </div>
            </div>
            
            <div className="text-center">
              <p className={`text-5xl font-bold ${getCapacidadeColor()}`}>
                {capacidadeAtual} / {capacidadeMaxima}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {percentualOcupacao.toFixed(0)}% ocupado
              </p>
            </div>

            <button
              onClick={() => setIsSettingsOpen(true)}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition-colors flex items-center gap-2"
              aria-label="Configurações"
            >
              <Settings className="w-5 h-5" />
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
        <div className="flex flex-wrap gap-4 mb-8">
          <button
            onClick={handleAddNewChild}
            className="flex-1 min-w-[250px] px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:opacity-90 transition-opacity shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            <Plus className="w-6 h-6" />
            Nova Criança
          </button>
          
          <button
            onClick={() => setIsObservationsOpen(true)}
            className="flex-1 min-w-[250px] px-6 py-4 bg-gradient-to-r from-green-600 to-teal-600 text-white font-bold rounded-xl hover:opacity-90 transition-opacity shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            <BookOpen className="w-6 h-6" />
            Sobre o Culto
          </button>
        </div>

        {/* Children Grid */}
        {children.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center border-2 border-dashed border-gray-300">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-400 mb-2">
              Nenhuma criança cadastrada
            </h3>
            <p className="text-gray-500 mb-6">
              Clique no botão acima para adicionar a primeira criança
            </p>
            <button
              onClick={handleAddNewChild}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-lg hover:opacity-90 transition-opacity shadow-md hover:shadow-lg inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Adicionar Criança
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

