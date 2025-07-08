// src/pages/LoginPage.js
import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import Footer from '../components/Footer'; // Importamos o Footer

function LoginPage({ onNavigate }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });
      if (error) throw error;
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-gray-900">
      <div 
        className="absolute top-0 left-0 w-full h-full bg-cover bg-center opacity-20"
        style={{backgroundImage: "url('https://images.pexels.com/photos/270085/pexels-photo-270085.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')"}}
      ></div>

      <div className="flex-grow flex items-center justify-center p-4">
        <button onClick={() => onNavigate('home')} className="absolute top-6 left-6 text-white bg-black/30 rounded-full p-2 hover:bg-black/50 transition-colors z-20">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
        </button>
        <div className="relative bg-white/10 backdrop-blur-md p-8 rounded-lg shadow-2xl w-full max-w-md border border-white/20">
          <h2 className="text-3xl font-bold text-center text-white mb-6">Login</h2>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-white/80 text-sm font-bold mb-2" htmlFor="email">Email</label>
              <input className="shadow appearance-none border border-white/20 rounded w-full py-3 px-4 bg-white/10 text-white leading-tight focus:outline-none focus:shadow-outline" id="email" type="email" placeholder="seuemail@exemplo.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="mb-6">
              <label className="block text-white/80 text-sm font-bold mb-2" htmlFor="password">Senha</label>
              <input className="shadow appearance-none border border-white/20 rounded w-full py-3 px-4 bg-white/10 text-white mb-3 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="******************" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div className="flex items-center justify-between">
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline disabled:bg-gray-400" type="submit" disabled={loading}>
                {loading ? 'A entrar...' : 'Entrar'}
              </button>
            </div>
            <p className="text-center text-white/70 text-sm mt-6">
              Não tem uma conta?{' '}
              <button type="button" onClick={() => onNavigate('signup')} className="font-bold text-white hover:underline">
                Cadastre-se
              </button>
            </p>
          </form>
        </div>
      </div>
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}

export default LoginPage;
