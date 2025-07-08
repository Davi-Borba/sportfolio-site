// src/pages/SignUpPage.js
import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import Footer from '../components/Footer'; // Importamos o Footer

function SignUpPage({ onNavigate }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [city, setCity] = useState('');
  const [sport, setSport] = useState('');
  const [profileType, setProfileType] = useState('Atleta');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (event) => {
    event.preventDefault();
    if (!fullName || !email || !password || !city || !sport) {
      alert('Por favor, preencha todos os campos.');
      return;
    }
    setLoading(true);
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email,
        password: password,
      });
      if (authError) throw authError;
      if (authData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([{ id: authData.user.id, full_name: fullName, city: city, sport: sport, profile_type: profileType }]);
        if (profileError) throw profileError;
        alert('Registo concluído com sucesso!');
        onNavigate('login');
      }
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
        style={{backgroundImage: "url('https://images.pexels.com/photos/1263426/pexels-photo-1263426.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')"}}
      ></div>

      <div className="flex-grow flex items-center justify-center py-12 px-4">
        <button onClick={() => onNavigate('home')} className="absolute top-6 left-6 text-white bg-black/30 rounded-full p-2 hover:bg-black/50 transition-colors z-20">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
        </button>
        <div className="relative bg-white/10 backdrop-blur-md p-8 rounded-lg shadow-2xl w-full max-w-lg border border-white/20">
          <h2 className="text-3xl font-bold text-center text-white mb-8">Crie sua Conta</h2>
          <form onSubmit={handleSignUp}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="mb-4">
                <label className="block text-white/80 text-sm font-bold mb-2" htmlFor="fullName">Nome Completo</label>
                <input className="shadow appearance-none border border-white/20 rounded w-full py-3 px-4 bg-white/10 text-white" id="fullName" type="text" placeholder="Seu Nome" value={fullName} onChange={(e) => setFullName(e.target.value)} />
              </div>
              <div className="mb-4">
                <label className="block text-white/80 text-sm font-bold mb-2" htmlFor="email">Email</label>
                <input className="shadow appearance-none border border-white/20 rounded w-full py-3 px-4 bg-white/10 text-white" id="email" type="email" placeholder="seuemail@exemplo.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="mb-4">
                <label className="block text-white/80 text-sm font-bold mb-2" htmlFor="city">Cidade</label>
                <input className="shadow appearance-none border border-white/20 rounded w-full py-3 px-4 bg-white/10 text-white" id="city" type="text" placeholder="Ex: Porto Alegre, RS" value={city} onChange={(e) => setCity(e.target.value)} />
              </div>
              <div className="mb-4">
                <label className="block text-white/80 text-sm font-bold mb-2" htmlFor="sport">Modalidade</label>
                <input className="shadow appearance-none border border-white/20 rounded w-full py-3 px-4 bg-white/10 text-white" id="sport" type="text" placeholder="Ex: Futebol" value={sport} onChange={(e) => setSport(e.target.value)} />
              </div>
              <div className="mb-4">
                <label className="block text-white/80 text-sm font-bold mb-2" htmlFor="password">Senha</label>
                <input className="shadow appearance-none border border-white/20 rounded w-full py-3 px-4 bg-white/10 text-white" id="password" type="password" placeholder="Mínimo 6 caracteres" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <div className="mb-6">
                <label className="block text-white/80 text-sm font-bold mb-2" htmlFor="profileType">Eu sou</label>
                <select id="profileType" className="shadow border border-white/20 rounded w-full py-3 px-4 bg-slate-800 text-white" value={profileType} onChange={(e) => setProfileType(e.target.value)}>
                  <option>Atleta</option>
                  <option>Clube</option>
                </select>
              </div>
            </div>
            <div className="mt-6">
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg" type="submit" disabled={loading}>
                {loading ? 'A registar...' : 'Criar Conta'}
              </button>
            </div>
            <p className="text-center text-white/70 text-sm mt-6">
              Já tem uma conta?{' '}
              <button type="button" onClick={() => onNavigate('login')} className="font-bold text-white hover:underline">
                Faça Login
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

export default SignUpPage;
