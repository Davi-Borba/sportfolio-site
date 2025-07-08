// src/components/Header.js
import React from 'react';
import { supabase } from '../supabaseClient';

function Header({ onNavigate, session }) {
  const handleLogout = async () => {
    await supabase.auth.signOut();
    onNavigate('home');
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 transition-all duration-300 bg-black/20 backdrop-blur-sm">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <a href="#hero" className="text-2xl font-bold text-white">SportFolio</a>

          <div className="flex items-center space-x-6">
            <nav className="hidden md:flex items-center space-x-6">
              <a href="#plataforma" className="text-white hover:text-gray-300">A Plataforma</a>
              <a href="#features" className="text-white hover:text-gray-300">Funcionalidades</a>
              <a href="#about" className="text-white hover:text-gray-300">Sobre</a>
            </nav>

            <div className="hidden md:block w-px h-6 bg-white/30"></div>

            <nav>
              {!session ? (
                <>
                  <button onClick={() => onNavigate('login')} className="px-4 py-2 font-semibold text-white rounded-lg hover:bg-white/10">
                    Login
                  </button>
                  <button onClick={() => onNavigate('signup')} className="ml-2 px-4 py-2 font-semibold text-black bg-white rounded-lg hover:bg-gray-200 transition-colors">
                    Cadastre-se
                  </button>
                </>
              ) : (
                <button onClick={handleLogout} className="ml-4 px-4 py-2 font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors">
                  Sair
                </button>
              )}
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
