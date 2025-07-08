// src/App.js
import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import './App.css';
import AppHeader from './components/AppHeader';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import AthletesListPage from './pages/AthletesListPage';
import FeedPage from './pages/FeedPage';

function App() {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [currentPage, setCurrentPage] = useState('home');
  const [viewingProfileId, setViewingProfileId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Esta é a única fonte da verdade para a autenticação.
    // Ela dispara uma vez na carga inicial e depois em cada login/logout.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);

      if (session?.user) {
        try {
          // Se há uma sessão, busca o perfil correspondente.
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          if (error) throw error;
          setProfile(data);
          // Define a página padrão para utilizadores logados.
          if (!viewingProfileId) {
            setCurrentPage('feed');
          }
        } catch (error) {
          console.error("Erro ao buscar o perfil do utilizador:", error);
          setProfile(null);
        }
      } else {
        // Se não há sessão, limpa o perfil.
        setProfile(null);
        setCurrentPage('home');
      }
      
      // Independentemente do resultado, o carregamento inicial termina aqui.
      setLoading(false);
    });

    // Função de limpeza para remover o "ouvinte" quando o componente é desmontado.
    return () => {
      subscription.unsubscribe();
    };
  }, [viewingProfileId]); // A dependência garante que a lógica é reavaliada se sairmos de um perfil.

  const navigate = (page, id = null) => {
    if (page === 'profile') {
      setViewingProfileId(id);
    } else {
      setViewingProfileId(null);
      setCurrentPage(page);
    }
  };

  // 1. Mostra o ecrã de carregamento enquanto a sessão inicial está a ser verificada.
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-700">A carregar...</div>;
  }

  // 2. Se há uma sessão, renderiza o layout da aplicação.
  if (session) {
    let pageComponent;
    if (viewingProfileId) {
      pageComponent = <ProfilePage profileId={viewingProfileId} onNavigate={navigate} session={session} />;
    } else {
      switch (currentPage) {
        case 'dashboard':
          pageComponent = <DashboardPage session={session} onNavigate={navigate} />;
          break;
        case 'athletes_list':
          pageComponent = <AthletesListPage onNavigate={navigate} />;
          break;
        case 'feed':
        default:
          pageComponent = <FeedPage onNavigate={navigate} session={session} profile={profile} />;
          break;
      }
    }
    return (
      <div className="min-h-screen bg-gray-100">
        <AppHeader session={session} onNavigate={navigate} currentPage={currentPage} profile={profile} />
        <main>{pageComponent}</main>
      </div>
    );
  }

  // 3. Se não há sessão, renderiza as páginas públicas.
  switch (currentPage) {
    case 'login':
      return <LoginPage onNavigate={navigate} />;
    case 'signup':
      return <SignUpPage onNavigate={navigate} />;
    default:
      return <LandingPage onNavigate={navigate} session={session} />;
  }
}

export default App;
