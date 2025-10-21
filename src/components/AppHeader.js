// src/components/AppHeader.js
import React from 'react';
import { supabase } from '../supabaseClient';

function AppHeader({ session, onNavigate, currentPage, profile }) {
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const navLinkClasses = (page) => 
    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      currentPage === page 
      ? 'bg-blue-600 text-white' 
      : 'text-gray-700 hover:bg-gray-200'
    }`;

  return (
    <header className="bg-white shadow-md sticky top-0 z-50 pointer-events-auto">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center py-3">
          <div className="flex items-center space-x-8">
            <button onClick={() => onNavigate('feed')} className="text-2xl font-bold text-blue-600">
              SportFolio
            </button>
            <nav className="hidden md:flex items-center space-x-2">
              <button onClick={() => onNavigate('feed')} className={navLinkClasses('feed')}>Feed</button>
              <button onClick={() => onNavigate('dashboard')} className={navLinkClasses('dashboard')}>Meu Painel</button>
              {profile?.profile_type === 'Clube' && (
                <button onClick={() => onNavigate('athletes_list')} className={navLinkClasses('athletes_list')}>
                  Buscar Atletas
                </button>
              )}
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <button onClick={() => onNavigate('profile', session.user.id)} className="font-semibold text-gray-700 hover:text-blue-600">
              Ver Perfil
            </button>
            <button onClick={handleLogout} className="px-4 py-2 font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600">
              Sair
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default AppHeader;
