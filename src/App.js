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
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [viewingProfileId, setViewingProfileId] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [profile, setProfile] = useState(null);

  // Navigation function
  const navigate = (page, options = {}) => {
    if (page === 'profile' && options.profileId) {
      setViewingProfileId(options.profileId);
    } else {
      setViewingProfileId(null);
    }
    setCurrentPage(page);
  };

  // Function to fetch user profile
  const fetchUserProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setProfile(data);
      return data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  };

  // Function to check user permissions
  const checkUserPermissions = async (session) => {
    if (!session?.user) return null;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      if (error) throw error;
      return data?.role || 'user';
    } catch (error) {
      console.error('Error checking user permissions:', error);
      return null;
    }
  };

  // Function to determine initial page based on user role
  const determineInitialPage = async (session) => {
    if (!session?.user) return 'landing';

    const role = await checkUserPermissions(session);
    setUserRole(role);

    // Determine initial page based on user role
    switch (role) {
      case 'admin':
        return 'dashboard';
      case 'athlete':
        return 'athletes_list';
      default:
        return 'feed';
    }
  };

  useEffect(() => {
    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        // Fetch user profile and determine initial page
        if (session.user) {
          fetchUserProfile(session.user.id);
          determineInitialPage(session).then(page => {
            setCurrentPage(page);
            setLoading(false);
          });
        }
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session && session.user) {
        fetchUserProfile(session.user.id);
        determineInitialPage(session).then(page => {
          setCurrentPage(page);
        });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Update profile when userRole changes
  useEffect(() => {
    if (session?.user) {
      fetchUserProfile(session.user.id);
    }
  }, [userRole]);

  // 1. Show loading screen while initial session is being verified
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-700">Loading...</div>;
  }

  // 2. If there's a session, render the application layout
  if (session) {
    // Check if user has access to the current page based on their role
    const hasAccess = () => {
      switch (currentPage) {
        case 'dashboard':
          return userRole === 'admin';
        case 'athletes_list':
          return userRole === 'athlete';
        case 'profile':
          return true; // All authenticated users can view profiles
        default:
          return true; // Default pages are accessible to all authenticated users
      }
    };

    if (!hasAccess()) {
      // Redirect to appropriate page based on user role
      const defaultPage = determineInitialPage(session);
      setCurrentPage(defaultPage);
    }

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

  // 3. If no session, render public pages
  switch (currentPage) {
    case 'login':
      return <LoginPage onNavigate={navigate} />;
    case 'signup':
      return <SignUpPage onNavigate={navigate} />;
    case 'profile':
      return <ProfilePage profileId={viewingProfileId} onNavigate={navigate} session={session} />;
    default:
      return <LandingPage onNavigate={navigate} session={session} />;
  }
}

export default App;
