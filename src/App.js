// src/App.js
import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import './App.css'; // Certifique-se que o caminho do seu CSS está correto
import AppHeader from './components/AppHeader';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import AthletesListPage from './pages/AthletesListPage';
import FeedPage from './pages/FeedPage';

function App() {
  // 1. Estados centralizados e sem duplicação
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [currentPage, setCurrentPage] = useState('home');
  const [viewingProfileId, setViewingProfileId] = useState(null);
  const [isInitialSetupDone, setIsInitialSetupDone] = useState(false);

  // 2. useEffect único para gerenciar a autenticação
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);

      if (session?.user) {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (error) throw error;
          setProfile(data);

          if (!isInitialSetupDone) {
            let initialPage = 'feed';
            if (data?.role === 'admin') {
              initialPage = 'dashboard';
            } else if (data?.role === 'athlete') {
              initialPage = 'athletes_list';
            }
            
            if (!viewingProfileId) {
               setCurrentPage(initialPage);
            }
            setIsInitialSetupDone(true);
          }

        } catch (error) {
          console.error("Erro ao buscar o perfil do utilizador:", error);
          setProfile(null);
          if (!isInitialSetupDone) {
            setCurrentPage('feed');
            setIsInitialSetupDone(true);
          }
        }
      } else {
        setProfile(null);
        setViewingProfileId(null);
        setCurrentPage('home');
        setIsInitialSetupDone(false);
      }
      
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [isInitialSetupDone]);

  // 3. Função de navegação
  const navigate = (page, id = null) => {
    if (page === 'profile') {
      setViewingProfileId(id);
    } else {
      setViewingProfileId(null);
      setCurrentPage(page);
    }
  };

  // 4. Lógica de Renderização
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-700">A carregar...</div>;
  }

  // 2. If there's a session, render the application layout
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
        <main className="relative z-0 p-4 md:p-8">
            {pageComponent}
        </main>
      </div>
    );
  }

  switch (currentPage) {
    case 'login':
      return <LoginPage onNavigate={navigate} />;
    case 'signup':
      return <SignUpPage onNavigate={navigate} />;
    case 'home':
    default:
      return <LandingPage onNavigate={navigate} />;
  }
}

export default App;
