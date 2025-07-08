// src/pages/LandingPage.js
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

// Lista de imagens com o 4º link corrigido
const heroImages = [
  'https://images.pexels.com/photos/47730/the-ball-stadion-football-the-pitch-47730.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&dpr=2', // Futebol
  'https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&dpr=2', // Basquete
  'https://images.pexels.com/photos/1618269/pexels-photo-1618269.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&dpr=2', // Vólei
  'https://images.pexels.com/photos/3768916/pexels-photo-3768916.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&dpr=2', // Natação
];

// Funcionalidades atualizadas para 8 itens
const features = [
  { 
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>,
    title: "CV Esportivo",
    description: "Crie um currículo desportivo completo, com seu histórico, estatísticas e conquistas."
  },
  { 
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 8-6 4 6 4V8Z"/><path d="M14 12H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h12v10Z"/></svg>,
    title: "Upload de Mídia",
    description: "Mostre seu talento em ação. Faça upload de fotos e vídeos dos seus melhores momentos."
  },
  { 
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>,
    title: "Busca Avançada",
    description: "Recrutadores podem encontrar atletas com filtros detalhados por modalidade, cidade e posição."
  },
  { 
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    title: "Rede de Conexões",
    description: "Conecte-se com outros atletas, treinadores e clubes, expandindo sua rede profissional."
  },
  { 
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
    title: "Análise de Desempenho",
    description: "Registe e acompanhe o seu desempenho com estatísticas detalhadas por jogo e temporada."
  },
  { 
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>,
    title: "Avaliação de Habilidades",
    description: "Receba e forneça avaliações de habilidades técnicas e comportamentais para um feedback 360°."
  },
  { 
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>,
    title: "Visibilidade",
    description: "Tenha um perfil público e partilhável para aumentar sua exposição a oportunidades únicas."
  },
  { 
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
    title: "Mensagens Diretas",
    description: "Comunique-se de forma segura e direta com olheiros, clubes e outros atletas na plataforma."
  },
];

function LandingPage({ onNavigate, session }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const goToNext = () => setCurrentImageIndex(prev => (prev + 1) % heroImages.length);
  const goToPrevious = () => setCurrentImageIndex(prev => (prev - 1 + heroImages.length) % heroImages.length);
  const goToSlide = (index) => setCurrentImageIndex(index);

  useEffect(() => {
    const timer = setInterval(goToNext, 5000);
    return () => clearInterval(timer);
  }, []);

  const SectionWrapper = ({ id, children, className = '' }) => (
    <section id={id} className={`py-20 md:py-28 ${className}`}>
      <div className="container mx-auto px-6">
        {children}
      </div>
    </section>
  );

  return (
    <div className="bg-gray-50">
      <Header onNavigate={onNavigate} session={session} />

      <section id="hero" className="relative h-screen flex items-center justify-center text-white text-center">
        {heroImages.map((image, index) => (
          <div key={index} className="absolute top-0 left-0 w-full h-full bg-cover bg-center transition-opacity duration-1000" style={{ backgroundImage: `url(${image})`, opacity: index === currentImageIndex ? 1 : 0 }} />
        ))}
        <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-gray-50 to-transparent"></div>
        <div className="relative z-10 p-4">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 drop-shadow-lg">Onde o Talento Encontra a Oportunidade</h1>
          <p className="text-xl md:text-2xl mb-8 drop-shadow-md">Sua vitrine para o mundo do esporte. Crie seu portfólio, conecte-se e seja descoberto.</p>
          <button onClick={() => onNavigate('signup')} className="px-8 py-3 font-bold text-blue-600 bg-white rounded-lg hover:bg-gray-200 transition-transform transform hover:scale-105">Comece Agora</button>
        </div>
        <div className="absolute bottom-10 z-10 flex space-x-3">
          {heroImages.map((_, slideIndex) => (
            <button key={slideIndex} onClick={() => goToSlide(slideIndex)} className={`w-3 h-3 rounded-full transition-all ${currentImageIndex === slideIndex ? 'bg-white scale-125' : 'bg-white/50'}`}></button>
          ))}
        </div>
        <button onClick={goToPrevious} className="absolute left-5 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/20 rounded-full hover:bg-white/40"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg></button>
        <button onClick={goToNext} className="absolute right-5 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/20 rounded-full hover:bg-white/40"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg></button>
      </section>

      <SectionWrapper id="plataforma">
        <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-800 mb-16">A Plataforma Ideal para Atletas e Clubes</h2>
        <div className="flex flex-wrap -mx-4">
          <div className="w-full md:w-1/2 px-4 mb-8">
            <div className="bg-white rounded-lg shadow-xl p-10 h-full">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0"><svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600"><path d="M7 20.5L2 17.5l5-10 5 10-5 3Z"/><path d="M14.5 20.5L9.5 17.5l5-10 5 10-5 3Z"/><path d="M12 22V11"/><circle cx="12" cy="7" r="4"/></svg></div>
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">Para Atletas</h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-2 text-lg">
                    <li>Crie um portfólio profissional e completo.</li>
                    <li>Faça upload de vídeos e fotos de destaque.</li>
                    <li>Aumente sua visibilidade para recrutadores.</li>
                    <li>Encontre oportunidades de patrocínio.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/2 px-4 mb-8">
            <div className="bg-white rounded-lg shadow-xl p-10 h-full">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0"><svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><circle cx="12" cy="12" r="3"/></svg></div>
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">Para Clubes e Olheiros</h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-2 text-lg">
                    <li>Acesse uma vasta base de dados de talentos.</li>
                    <li>Utilize filtros avançados para encontrar perfis.</li>
                    <li>Otimize seu processo de recrutamento.</li>
                    <li>Analise estatísticas de desempenho.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SectionWrapper>

      <SectionWrapper id="features" className="bg-slate-900 text-white">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-20">Funcionalidades Principais</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-16">
          {features.map((feature, index) => (
            <div key={index} className="group text-center cursor-pointer">
              <div className="flex items-center justify-center w-24 h-24 mx-auto mb-5 bg-slate-800 rounded-full transition-all duration-300 group-hover:bg-blue-600 group-hover:scale-110">
                {React.cloneElement(feature.icon, { width: 32, height: 32 })}
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-slate-400 text-sm h-0 opacity-0 transition-all duration-300 group-hover:h-auto group-hover:opacity-100">{feature.description}</p>
            </div>
          ))}
        </div>
      </SectionWrapper>

      <SectionWrapper id="about" className="bg-white">
        <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-800 mb-12">Sobre o SportFolio</h2>
        <div className="max-w-4xl mx-auto text-xl text-gray-700 leading-relaxed space-y-6 text-justify">
          <p>
            O SportFolio nasceu da paixão pelo esporte e da crença no potencial ilimitado de cada atleta. Em um cenário tão dinâmico e competitivo como o do Brasil, sabemos que muitos talentos se perdem por falta de uma vitrine adequada. Nossa missão é quebrar essa barreira, construindo uma ponte digital e direta entre atletas promissores e as oportunidades que podem transformar as suas carreiras.
          </p>
          <p>
            Acreditamos que cada drible, cada ponto e cada segundo de dedicação merecem ser vistos. Por isso, criamos uma plataforma onde o desempenho é a moeda mais valiosa. Para os atletas, é a chance de ter um portfólio profissional e dinâmico. Para os clubes e olheiros, é a ferramenta definitiva para descobrir talentos de forma eficiente e precisa. Mais do que uma plataforma, somos uma comunidade dedicada a impulsionar sonhos, celebrar conquistas e fortalecer o ecossistema desportivo nacional.
          </p>
        </div>
      </SectionWrapper>

      <Footer />
    </div>
  );
}

export default LandingPage;
