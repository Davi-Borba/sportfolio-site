// src/pages/ProfilePage.js
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import Lightbox from '../components/Lightbox';

const calculateAge = (birthDate) => {
  if (!birthDate) return null;
  const today = new Date();
  const birthDateObj = new Date(birthDate);
  let age = today.getFullYear() - birthDateObj.getFullYear();
  const m = today.getMonth() - birthDateObj.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDateObj.getDate())) {
    age--;
  }
  return age;
};

const StatCard = ({ label, value, icon }) => (
  <div className="bg-blue-50 p-4 rounded-lg text-center">
    <div className="flex justify-center text-blue-600 mb-2">{icon}</div>
    <p className="text-2xl font-bold text-gray-800">{value}</p>
    <p className="text-sm text-gray-500">{label}</p>
  </div>
);

const AthletePublicProfile = ({ profile, setProfile, avatarUrl, mediaUrls, setLightboxMedia, session }) => {
  const age = calculateAge(profile.birth_date);
  const [currentUserProfile, setCurrentUserProfile] = useState(null);

  useEffect(() => {
    if (session) {
      const getCurrentUserProfile = async () => {
        let { data } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
        setCurrentUserProfile(data);
      };
      getCurrentUserProfile();
    }
  }, [session]);

  const handleEndorse = async (careerIndex) => {
    if (!currentUserProfile || currentUserProfile.profile_type !== 'Clube') {
      alert('Apenas clubes podem endossar o histórico de um atleta.');
      return;
    }

    const confirmation = window.confirm(`Você confirma que ${profile.full_name} fez parte do seu clube (${currentUserProfile.full_name}) durante este período?`);
    if (!confirmation) return;

    try {
      const updatedCareerHistory = [...profile.career_history];
      updatedCareerHistory[careerIndex].verified_by = currentUserProfile.full_name;
      const { error } = await supabase.from('profiles').update({ career_history: updatedCareerHistory }).eq('id', profile.id);
      if (error) throw error;
      setProfile({ ...profile, career_history: updatedCareerHistory });
      alert('Histórico endossado com sucesso!');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="bg-white p-6 md:p-10 rounded-lg shadow-2xl w-full max-w-5xl mx-auto">
      <section className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-8 pb-8 border-b">
        <img src={avatarUrl || `https://placehold.co/200x200/EFEFEF/7B7B7B?text=${profile.full_name.charAt(0)}`} alt="Avatar" className="w-40 h-40 md:w-48 md:h-48 rounded-full object-cover border-4 border-blue-500 shadow-lg"/>
        <div className="flex-1">
          <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800">{profile.full_name}</h1>
            <div className="group relative flex items-center">
              {profile.is_verified ? (<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor" className="text-blue-500"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>) : (<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor" className="text-gray-300"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>)}
              <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-max px-2 py-1 bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100">{profile.is_verified ? 'Perfil Verificado' : 'Perfil Não Verificado'}</span>
            </div>
          </div>
          <p className="text-xl text-blue-600 font-semibold">{profile.sport} {profile.position ? `| ${profile.position}` : ''}</p>
          <p className="text-lg text-gray-500 mt-2 flex items-center justify-center md:justify-start"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>{profile.city}</p>
        </div>
      </section>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-8">
        <aside className="lg:col-span-1 lg:order-last space-y-8">
          <div className="p-6 bg-gray-50 rounded-lg border">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Dados Físicos</h3>
            <div className="grid grid-cols-2 gap-4">
              {age && <StatCard label="Idade" value={`${age} anos`} icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>} />}
              {profile.height && <StatCard label="Altura" value={`${profile.height} cm`} icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg>} />}
              {profile.weight && <StatCard label="Peso" value={`${profile.weight} kg`} icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>} />}
              {profile.dominant_foot_hand && <StatCard label="Pé/Mão" value={profile.dominant_foot_hand} icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-2"/><path d="M12 12h8"/></svg>} />}
            </div>
          </div>
          {profile.achievements && profile.achievements.length > 0 && (
            <div className="p-6 bg-gray-50 rounded-lg border">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Conquistas</h3>
              <ul className="space-y-3 list-disc list-inside text-gray-700">{profile.achievements.map((item, index) => (<li key={index}>{item.description}</li>))}</ul>
            </div>
          )}
        </aside>
        <div className="lg:col-span-2 space-y-10">
          {profile.bio && (<section><h2 className="text-2xl font-bold text-gray-800 mb-4">Sobre Mim</h2><p className="text-gray-600 whitespace-pre-wrap text-lg leading-relaxed">{profile.bio}</p></section>)}
          {profile.career_history && profile.career_history.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Histórico de Carreira</h2>
              <div className="space-y-4">{profile.career_history.map((item, index) => (<div key={index} className="p-4 bg-gray-50 rounded-lg border flex flex-col sm:flex-row justify-between items-start sm:items-center"><div className="mb-2 sm:mb-0"><p className="font-semibold text-gray-800">{item.club}</p><p className="text-gray-600 text-sm">{item.period}</p></div><div>{item.verified_by ? (<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"><svg className="-ml-0.5 mr-1.5 h-2 w-2 text-green-400" fill="currentColor" viewBox="0 0 8 8"><circle cx="4" cy="4" r="3" /></svg>Verificado por {item.verified_by}</span>) : (currentUserProfile?.profile_type === 'Clube' && (<button onClick={() => handleEndorse(index)} className="px-3 py-1 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">Endossar</button>))}</div></div>))}</div>
            </section>
          )}
          {mediaUrls.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Galeria de Mídia</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {mediaUrls.map((item, index) => (<div key={index} className="bg-gray-50 rounded-lg overflow-hidden shadow-lg cursor-pointer" onClick={() => setLightboxMedia(item)}>{item.type.startsWith('video') ? (<div className="relative"><video className="w-full h-48 object-cover"><source src={item.url} type={item.type} /></video><div className="absolute inset-0 flex items-center justify-center bg-black/30"><svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg></div></div>) : (<img src={item.url} alt={item.description} className="w-full h-48 object-cover" />)}<div className="p-4"><p className="text-gray-700 truncate">{item.description || "Mídia do Atleta"}</p></div></div>))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

const ClubPublicProfile = ({ profile, avatarUrl }) => {
  return (
    <div className="bg-white p-6 md:p-10 rounded-lg shadow-2xl w-full max-w-5xl mx-auto">
      <section className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-8 pb-8">
        <img src={avatarUrl || `https://placehold.co/200x200/EFEFEF/7B7B7B?text=${profile.full_name.charAt(0)}`} alt="Avatar do Clube" className="w-40 h-40 md:w-48 md:h-48 rounded-lg object-cover border-4 border-blue-500 shadow-lg"/>
        <div className="flex-1">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800">{profile.full_name}</h1>
          <p className="text-lg text-gray-500 mt-2 flex items-center justify-center md:justify-start"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>{profile.city}</p>
        </div>
      </section>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-8">
        <div className="lg:col-span-2 space-y-10">
          {profile.club_description && (<section><h2 className="text-2xl font-bold text-gray-800 mb-4">Sobre o Clube</h2><p className="text-gray-600 whitespace-pre-wrap text-lg leading-relaxed">{profile.club_description}</p></section>)}
          {profile.open_vacancies && profile.open_vacancies.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Vagas em Aberto</h2>
              <div className="space-y-4">{profile.open_vacancies.map((item, index) => (<div key={index} className="p-4 bg-blue-50 rounded-lg border border-blue-200 flex justify-between items-center"><p className="font-bold text-blue-800">{item.position}</p><p className="text-blue-600 bg-blue-100 px-3 py-1 rounded-full text-sm font-semibold">{item.category}</p></div>))}</div>
            </section>
          )}
        </div>
        <aside className="lg:col-span-1 space-y-6">
          <div className="p-6 bg-gray-50 rounded-lg border">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Informações</h3>
            <ul className="space-y-3 text-gray-700">
              {profile.website && <li className="flex items-start"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 mt-1 flex-shrink-0"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg><a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">{profile.website}</a></li>}
              {profile.instagram_handle && <li className="flex items-start"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 mt-1 flex-shrink-0"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg><a href={`https://instagram.com/${profile.instagram_handle.replace('@','')}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{profile.instagram_handle}</a></li>}
              {profile.phone_contact && <li className="flex items-start"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 mt-1 flex-shrink-0"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>{profile.phone_contact}</li>}
              {profile.foundation_year && <li className="flex items-start"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 mt-1 flex-shrink-0"><path d="M8 2v4"/><path d="M16 2v4"/><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M3 10h18"/></svg>Fundado em {profile.foundation_year}</li>}
              {profile.competition_level && <li className="flex items-start"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 mt-1 flex-shrink-0"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>{profile.competition_level}</li>}
              {profile.specialties && <li className="flex items-start"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 mt-1 flex-shrink-0"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>{profile.specialties}</li>}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
};

// --- Componente Principal da Página ---
function ProfilePage({ profileId, onNavigate, session }) {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [mediaUrls, setMediaUrls] = useState([]);
  const [lightboxMedia, setLightboxMedia] = useState(null);

  useEffect(() => {
    const getProfile = async () => {
      if (!profileId) return;
      try {
        setLoading(true);
        let { data, error } = await supabase.from('profiles').select(`*`).eq('id', profileId).single();
        if (error) throw error;
        if (data) {
          setProfile(data);
          if (data.avatar_url) {
            const { data: imageData } = await supabase.storage.from('avatars').download(data.avatar_url);
            setAvatarUrl(URL.createObjectURL(imageData));
          }
          if (data.media_gallery && data.media_gallery.length > 0) {
            const urls = await Promise.all(data.media_gallery.map(async (item) => {
              const { data: mediaData } = await supabase.storage.from('media').download(item.filePath);
              return { url: URL.createObjectURL(mediaData), type: item.type, description: item.description };
            }));
            setMediaUrls(urls);
          }
        }
      } catch (error) {
        console.error('Erro ao buscar perfil:', error.message);
      } finally {
        setLoading(false);
      }
    };
    getProfile();
  }, [profileId]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-100">A carregar perfil...</div>;
  if (!profile) return <div className="min-h-screen flex items-center justify-center bg-gray-100">Perfil não encontrado.</div>;

  return (
    <>
      {lightboxMedia && <Lightbox media={lightboxMedia} onClose={() => setLightboxMedia(null)} />}
      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow-md sticky top-0 z-20">
          <div className="container mx-auto px-6 py-4 flex justify-between items-center">
            <div className="text-2xl font-bold text-blue-600">SportFolio</div>
            <button onClick={() => onNavigate('dashboard')} className="px-4 py-2 font-semibold text-gray-700 rounded-lg hover:bg-gray-100">
              Voltar
            </button>
          </div>
        </header>
        <main className="container mx-auto p-4 md:p-8">
          {profile.profile_type === 'Atleta' ? (
            <AthletePublicProfile profile={profile} setProfile={setProfile} avatarUrl={avatarUrl} mediaUrls={mediaUrls} setLightboxMedia={setLightboxMedia} session={session} />
          ) : (
            <ClubPublicProfile profile={profile} avatarUrl={avatarUrl} />
          )}
        </main>
      </div>
    </>
  );
}

export default ProfilePage;
