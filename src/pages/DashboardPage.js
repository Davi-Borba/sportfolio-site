// src/pages/DashboardPage.js
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import Avatar from '../components/Avatar';

// --- Formulário de Edição para Atletas ---
const AthleteProfileForm = ({ profile, session, onProfileUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState(profile.full_name || '');
  const [city, setCity] = useState(profile.city || '');
  const [sport, setSport] = useState(profile.sport || '');
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url || '');
  const [bio, setBio] = useState(profile.bio || '');
  const [height, setHeight] = useState(profile.height || '');
  const [weight, setWeight] = useState(profile.weight || '');
  const [birthDate, setBirthDate] = useState(profile.birth_date || '');
  const [position, setPosition] = useState(profile.position || '');
  const [dominantFootHand, setDominantFootHand] = useState(profile.dominant_foot_hand || '');
  const [careerHistory, setCareerHistory] = useState(profile.career_history && profile.career_history.length > 0 ? profile.career_history : [{ club: '', period: '' }]);
  const [achievements, setAchievements] = useState(profile.achievements && profile.achievements.length > 0 ? profile.achievements : [{ description: '' }]);
  const [mediaGallery, setMediaGallery] = useState(profile.media_gallery || []);

  const handleUpdate = async (event) => {
    if (event) event.preventDefault();
    setLoading(true);
    const updates = {
      id: session.user.id,
      full_name: fullName, city, sport, avatar_url: avatarUrl, bio, height, weight, birth_date: birthDate, position, dominant_foot_hand: dominantFootHand,
      career_history: careerHistory.filter(item => item.club && item.period),
      achievements: achievements.filter(item => item.description),
      media_gallery: mediaGallery,
      updated_at: new Date(),
    };
    await onProfileUpdate(updates);
    setLoading(false);
  };
  
  const handleListChange = (index, field, value, list, setList) => {
    const newList = [...list];
    newList[index][field] = value;
    setList(newList);
  };
  const addListItem = (list, setList, newItem) => {
    setList([...list, newItem]);
  };
  const removeListItem = (index, list, setList) => {
    const newList = list.filter((_, i) => i !== index);
    setList(newList);
  };

  const uploadMedia = async (event) => {
    try {
      if (!event.target.files || event.target.files.length === 0) throw new Error('Selecione um ficheiro para carregar.');
      const file = event.target.files[0];
      const fileName = `${session.user.id}/${Date.now()}.${file.name.split('.').pop()}`;
      let { error } = await supabase.storage.from('media').upload(fileName, file);
      if (error) throw error;
      const newMediaItem = { filePath: fileName, type: file.type, description: 'Nova Mídia' };
      setMediaGallery([...mediaGallery, newMediaItem]);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <form onSubmit={handleUpdate} className="space-y-8">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 border-b pb-4 mb-6">Perfil Principal</h2>
        <div className="flex flex-col items-center mb-6"><Avatar url={avatarUrl} size={150} onUpload={(url) => { setAvatarUrl(url); handleUpdate(); }} /></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input type="text" placeholder="Nome Completo" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full border rounded-md p-3"/>
          <input type="text" value={session.user.email} disabled className="w-full bg-gray-100 border rounded-md p-3"/>
        </div>
        <div className="mt-6"><label className="block text-sm font-medium text-gray-700 mb-2">Biografia</label><textarea value={bio} onChange={(e) => setBio(e.target.value)} rows="5" className="w-full border rounded-md p-3" placeholder="Conte sobre sua trajetória..."></textarea></div>
      </div>
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 border-b pb-4 mb-6">Detalhes do Atleta</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div><label className="block text-sm font-medium text-gray-700 mb-2">Modalidade</label><input type="text" value={sport} onChange={(e) => setSport(e.target.value)} className="w-full border rounded-md p-3"/></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-2">Posição</label><input type="text" value={position} onChange={(e) => setPosition(e.target.value)} className="w-full border rounded-md p-3"/></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-2">Cidade</label><input type="text" value={city} onChange={(e) => setCity(e.target.value)} className="w-full border rounded-md p-3"/></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-2">Data de Nascimento</label><input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} className="w-full border rounded-md p-3"/></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-2">Altura (cm)</label><input type="number" value={height} onChange={(e) => setHeight(e.target.value)} className="w-full border rounded-md p-3"/></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-2">Peso (kg)</label><input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} className="w-full border rounded-md p-3"/></div>
          <div className="md:col-span-3"><label className="block text-sm font-medium text-gray-700 mb-2">Pé/Mão Dominante</label><input type="text" value={dominantFootHand} onChange={(e) => setDominantFootHand(e.target.value)} className="w-full border rounded-md p-3"/></div>
        </div>
      </div>
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Histórico de Carreira</h3>
        {careerHistory.map((item, index) => (<div key={index} className="flex items-center gap-4 mb-4"><input type="text" placeholder="Clube" value={item.club} onChange={(e) => handleListChange(index, 'club', e.target.value, careerHistory, setCareerHistory)} className="block w-full p-2 border rounded-md"/><input type="text" placeholder="Período" value={item.period} onChange={(e) => handleListChange(index, 'period', e.target.value, careerHistory, setCareerHistory)} className="block w-1/2 p-2 border rounded-md"/><button type="button" onClick={() => removeListItem(index, careerHistory, setCareerHistory)} className="p-2 text-red-500">&times;</button></div>))}
        <button type="button" onClick={() => addListItem(careerHistory, setCareerHistory, { club: '', period: '' })} className="mb-6 px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50">Adicionar Clube</button>
        <h3 className="text-lg font-semibold text-gray-700 mb-4 mt-6">Títulos e Conquistas</h3>
        {achievements.map((item, index) => (<div key={index} className="flex items-center gap-4 mb-4"><textarea placeholder="Descrição da Conquista" value={item.description} onChange={(e) => handleListChange(index, 'description', e.target.value, achievements, setAchievements)} className="block w-full p-2 border rounded-md" rows="2"></textarea><button type="button" onClick={() => removeListItem(index, achievements, setAchievements)} className="p-2 text-red-500">&times;</button></div>))}
        <button type="button" onClick={() => addListItem(achievements, setAchievements, { description: '' })} className="px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50">Adicionar Conquista</button>
      </div>
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 border-b pb-4 mb-6">Galeria de Mídia</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {mediaGallery.map((item, index) => (<div key={index} className="relative group"><img src={URL.createObjectURL(new Blob())} alt={item.description} className="w-full h-32 object-cover rounded-md bg-gray-200"/><button type="button" onClick={() => removeListItem(index, mediaGallery, setMediaGallery)} className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100">&times;</button></div>))}
          <label htmlFor="media-upload" className="w-full h-32 border-2 border-dashed rounded-md flex items-center justify-center text-gray-400 hover:bg-gray-50 cursor-pointer">+ Adicionar<input id="media-upload" type="file" className="hidden" onChange={uploadMedia} accept="image/*,video/*"/></label>
        </div>
      </div>
      <div className="mt-8"><button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg" disabled={loading}>{loading ? 'A guardar...' : 'Salvar Alterações'}</button></div>
    </form>
  );
};

// --- Formulário de Edição para Clubes ---
const ClubProfileForm = ({ profile, session, onProfileUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState(profile.full_name || '');
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url || '');
  const [clubDescription, setClubDescription] = useState(profile.club_description || '');
  const [website, setWebsite] = useState(profile.website || '');
  const [instagramHandle, setInstagramHandle] = useState(profile.instagram_handle || '');
  const [phoneContact, setPhoneContact] = useState(profile.phone_contact || '');
  const [foundationYear, setFoundationYear] = useState(profile.foundation_year || '');
  const [competitionLevel, setCompetitionLevel] = useState(profile.competition_level || '');
  const [specialties, setSpecialties] = useState(profile.specialties || '');
  const [openVacancies, setOpenVacancies] = useState(profile.open_vacancies && profile.open_vacancies.length > 0 ? profile.open_vacancies : [{ position: '', category: '' }]);

  const handleUpdate = async (event) => {
    if (event) event.preventDefault();
    setLoading(true);
    const updates = {
      id: session.user.id,
      full_name: fullName,
      avatar_url: avatarUrl,
      club_description: clubDescription,
      website,
      instagram_handle: instagramHandle,
      phone_contact: phoneContact,
      foundation_year: foundationYear,
      competition_level: competitionLevel,
      specialties,
      open_vacancies: openVacancies.filter(item => item.position && item.category),
      updated_at: new Date(),
    };
    await onProfileUpdate(updates);
    setLoading(false);
  };

  const handleListChange = (index, field, value, list, setList) => {
    const newList = [...list];
    newList[index][field] = value;
    setList(newList);
  };
  const addListItem = (list, setList, newItem) => {
    setList([...list, newItem]);
  };
  const removeListItem = (index, list, setList) => {
    const newList = list.filter((_, i) => i !== index);
    setList(newList);
  };

  return (
    <form onSubmit={handleUpdate} className="space-y-8">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 border-b pb-4 mb-6">Perfil do Clube</h2>
        <div className="flex flex-col items-center mb-6"><Avatar url={avatarUrl} size={150} onUpload={(url) => { setAvatarUrl(url); handleUpdate(); }} /></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div><label className="block text-sm font-medium text-gray-700 mb-2">Nome do Clube</label><input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full border rounded-md p-3"/></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-2">Email de Contacto</label><input type="text" value={session.user.email} disabled className="w-full bg-gray-100 border rounded-md p-3"/></div>
        </div>
        <div className="mt-6"><label className="block text-sm font-medium text-gray-700 mb-2">Sobre o Clube</label><textarea value={clubDescription} onChange={(e) => setClubDescription(e.target.value)} rows="5" className="w-full border rounded-md p-3" placeholder="Fale sobre a história, filosofia e objetivos do seu clube..."></textarea></div>
      </div>
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 border-b pb-4 mb-6">Informações Gerais e Contacto</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div><label className="block text-sm font-medium text-gray-700 mb-2">Website</label><input type="url" value={website} onChange={(e) => setWebsite(e.target.value)} className="w-full border rounded-md p-3" placeholder="https://..."/></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-2">Instagram</label><input type="text" value={instagramHandle} onChange={(e) => setInstagramHandle(e.target.value)} className="w-full border rounded-md p-3" placeholder="@seuperfil"/></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-2">Telefone para Contacto</label><input type="tel" value={phoneContact} onChange={(e) => setPhoneContact(e.target.value)} className="w-full border rounded-md p-3"/></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-2">Ano de Fundação</label><input type="number" value={foundationYear} onChange={(e) => setFoundationYear(e.target.value)} className="w-full border rounded-md p-3" placeholder="Ex: 1990"/></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-2">Nível de Competição</label><input type="text" value={competitionLevel} onChange={(e) => setCompetitionLevel(e.target.value)} className="w-full border rounded-md p-3" placeholder="Ex: Amador, Profissional"/></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-2">Especialidades</label><input type="text" value={specialties} onChange={(e) => setSpecialties(e.target.value)} className="w-full border rounded-md p-3" placeholder="Ex: Formação de base, Futebol Feminino"/></div>
        </div>
      </div>
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 border-b pb-4 mb-6">Vagas Abertas</h2>
        {openVacancies.map((item, index) => (
          <div key={index} className="flex items-center gap-4 mb-4">
            <input type="text" placeholder="Posição (Ex: Goleiro)" value={item.position} onChange={(e) => handleListChange(index, 'position', e.target.value, openVacancies, setOpenVacancies)} className="block w-full border rounded-md p-2"/>
            <input type="text" placeholder="Categoria (Ex: Sub-17)" value={item.category} onChange={(e) => handleListChange(index, 'category', e.target.value, openVacancies, setOpenVacancies)} className="block w-full border rounded-md p-2"/>
            <button type="button" onClick={() => removeListItem(index, openVacancies, setOpenVacancies)} className="p-2 text-red-500 hover:text-red-700">&times;</button>
          </div>
        ))}
        <button type="button" onClick={() => addListItem(openVacancies, setOpenVacancies, { position: '', category: '' })} className="mt-2 px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50">Adicionar Vaga</button>
      </div>
      <div className="mt-8"><button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg" disabled={loading}>{loading ? 'A guardar...' : 'Salvar Alterações'}</button></div>
    </form>
  );
};

function DashboardPage({ session, onNavigate }) {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const getProfile = async () => {
      setLoading(true);
      const { user } = session;
      let { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      if (error) console.warn(error);
      setProfile(data || {});
      setLoading(false);
    };
    getProfile();
  }, [session]);

  const handleProfileUpdate = async (updates) => {
    let { error } = await supabase.from('profiles').upsert(updates);
    if (error) alert(error.message);
    else alert('Perfil atualizado com sucesso!');
  };

  return (
    <div className="container mx-auto p-6">
      {loading ? (<p>A carregar perfil...</p>) : profile ? (profile.profile_type === 'Atleta' ? (<AthleteProfileForm profile={profile} session={session} onProfileUpdate={handleProfileUpdate} />) : (<ClubProfileForm profile={profile} session={session} onProfileUpdate={handleProfileUpdate} />)) : (<p>Não foi possível carregar o perfil.</p>)}
    </div>
  );
}

export default DashboardPage;