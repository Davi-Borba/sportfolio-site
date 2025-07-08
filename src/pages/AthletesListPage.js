// src/pages/AthletesListPage.js
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

// O componente AthleteCard permanece o mesmo
function AthleteCard({ athlete, onNavigate }) {
  const [avatarUrl, setAvatarUrl] = useState(null);

  useEffect(() => {
    if (athlete.avatar_url) {
      supabase.storage.from('avatars').download(athlete.avatar_url)
        .then(({ data, error }) => {
          if (error) throw error;
          setAvatarUrl(URL.createObjectURL(data));
        });
    }
  }, [athlete.avatar_url]);

  return (
    <div 
      className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center text-center cursor-pointer transform hover:scale-105 transition-transform"
      onClick={() => onNavigate('profile', athlete.id)}
    >
      <img
        src={avatarUrl || `https://placehold.co/128x128/EFEFEF/7B7B7B?text=${athlete.full_name.charAt(0)}`}
        alt={`Foto de ${athlete.full_name}`}
        className="w-32 h-32 rounded-full object-cover border-2 border-gray-200"
      />
      <h3 className="text-xl font-bold mt-4 text-gray-800">{athlete.full_name}</h3>
      <p className="text-gray-600">{athlete.sport}</p>
      <p className="text-sm text-gray-500 mt-1">📍 {athlete.city}</p>
    </div>
  );
}

// Componente principal da página, agora com filtros
function AthletesListPage({ onNavigate }) {
  const [athletes, setAthletes] = useState([]);
  const [loading, setLoading] = useState(true);
  // Novos estados para os filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [sportFilter, setSportFilter] = useState('');
  const [cityFilter, setCityFilter] = useState('');

  // O useEffect agora depende dos filtros e vai correr novamente quando eles mudarem
  useEffect(() => {
    const fetchAthletes = async () => {
      try {
        setLoading(true);

        // A nossa query ao Supabase agora é dinâmica
        let query = supabase
          .from('profiles')
          .select('*')
          .eq('profile_type', 'Atleta');

        // Adiciona o filtro de nome (case-insensitive)
        if (searchTerm) {
          query = query.ilike('full_name', `%${searchTerm}%`);
        }
        // Adiciona o filtro de modalidade
        if (sportFilter) {
          query = query.ilike('sport', `%${sportFilter}%`);
        }
        // Adiciona o filtro de cidade
        if (cityFilter) {
          query = query.ilike('city', `%${cityFilter}%`);
        }

        const { data, error } = await query;

        if (error) throw error;

        setAthletes(data);
      } catch (error) {
        console.error('Erro ao buscar atletas:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAthletes();
  }, [searchTerm, sportFilter, cityFilter]); // Dependências do useEffect

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-blue-600">SportFolio</div>
          <button onClick={() => onNavigate('dashboard')} className="px-4 py-2 font-semibold text-gray-700 rounded-lg hover:bg-gray-100">
            Voltar ao Dashboard
          </button>
        </div>
      </header>
      <main className="container mx-auto p-6">
        <h1 className="text-4xl font-bold mb-4 text-center text-gray-800">Encontre Talentos</h1>

        {/* Secção de Filtros */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input 
              type="text"
              placeholder="Pesquisar por nome..."
              className="p-2 border rounded-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <input 
              type="text"
              placeholder="Filtrar por modalidade..."
              className="p-2 border rounded-md"
              value={sportFilter}
              onChange={(e) => setSportFilter(e.target.value)}
            />
            <input 
              type="text"
              placeholder="Filtrar por cidade..."
              className="p-2 border rounded-md"
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
            />
          </div>
        </div>

        {/* Grid para exibir os cards dos atletas */}
        {loading ? (
          <p className="text-center">A carregar...</p>
        ) : athletes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {athletes.map(athlete => (
              <AthleteCard key={athlete.id} athlete={athlete} onNavigate={onNavigate} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600">Nenhum atleta encontrado com estes critérios.</p>
        )}
      </main>
    </div>
  );
}

export default AthletesListPage;
