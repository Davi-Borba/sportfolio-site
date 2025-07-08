// src/pages/FeedPage.js
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import CreatePostModal from '../components/CreatePostModal';

const PostCard = ({ post, onNavigate, session, onPostUpdate }) => {
  const authorProfile = post.profiles;
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isLiked, setIsLiked] = useState(post.likes?.includes(session.user.id));

  useEffect(() => {
    if (authorProfile?.avatar_url) {
      const { data } = supabase.storage.from('avatars').getPublicUrl(authorProfile.avatar_url);
      setAvatarUrl(data.publicUrl);
    } else {
      setAvatarUrl(null);
    }
  }, [authorProfile]);

  const handleLike = async () => {
    const userId = session.user.id;
    const newLikes = isLiked 
      ? post.likes.filter(id => id !== userId) 
      : [...(post.likes || []), userId];

    const { data, error } = await supabase
      .from('posts')
      .update({ likes: newLikes })
      .eq('id', post.id)
      .select('*, profiles(*)')
      .single();

    if (error) {
      console.error("Erro ao curtir:", error);
    } else {
      onPostUpdate(data);
      setIsLiked(!isLiked);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const comment = {
      id: Date.now(),
      author_id: session.user.id,
      author_name: "Você",
      content: newComment,
      created_at: new Date().toISOString(),
    };

    const newComments = [...(post.comments || []), comment];
    const { data, error } = await supabase.from('posts').update({ comments: newComments }).eq('id', post.id).select('*, profiles(*)').single();

    if (error) console.error("Erro ao comentar:", error);
    else {
      onPostUpdate(data);
      setNewComment('');
    }
  };

  const handleShare = () => {
    const postUrl = `${window.location.origin}/post/${post.id}`;
    navigator.clipboard.writeText(postUrl)
      .then(() => alert("Link do post copiado para a área de transferência!"))
      .catch(err => console.error('Erro ao copiar link: ', err));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center mb-4">
        <img src={avatarUrl || `https://placehold.co/50x50/EFEFEF/7B7B7B?text=${authorProfile?.full_name?.charAt(0) || '?'}`} alt={`Avatar de ${authorProfile?.full_name}`} className="w-12 h-12 rounded-full object-cover mr-4"/>
        <div>
          <p className="font-bold text-gray-800 cursor-pointer hover:underline" onClick={() => onNavigate('profile', authorProfile.id)}>{authorProfile?.full_name}</p>
          <p className="text-sm text-gray-500">{new Date(post.created_at).toLocaleString('pt-BR')}</p>
        </div>
      </div>
      <p className="text-gray-700 whitespace-pre-wrap mb-4">{post.content}</p>
      {post.media_url && (post.media_type.startsWith('video') ? (<video controls className="w-full rounded-lg mt-4"><source src={post.media_url} type={post.media_type} /></video>) : (<img src={post.media_url} alt="Mídia do post" className="w-full rounded-lg mt-4" />))}

      <div className="border-t mt-4 pt-2 flex justify-around">
        <button onClick={handleLike} className={`flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100 ${isLiked ? 'text-blue-600' : 'text-gray-500'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
          <span>{post.likes?.length || 0} Curtir</span>
        </button>
        <button onClick={() => setShowComments(!showComments)} className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100 text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>
          <span>{post.comments?.length || 0} Comentar</span>
        </button>
        <button onClick={handleShare} className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100 text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/></svg>
          <span>Partilhar</span>
        </button>
      </div>
      {showComments && (
        <div className="mt-4 pt-4 border-t">
          <form onSubmit={handleAddComment} className="flex gap-2 mb-4">
            <input type="text" value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Escreva um comentário..." className="flex-1 p-2 border rounded-full"/>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-full">Enviar</button>
          </form>
          <div className="space-y-2">
            {post.comments?.map(comment => (<div key={comment.id} className="bg-gray-100 p-2 rounded-lg text-sm">{comment.content}</div>))}
          </div>
        </div>
      )}
    </div>
  );
};

const ProfileSummaryCard = ({ profile, onNavigate }) => {
  const [avatarUrl, setAvatarUrl] = useState(null);
  useEffect(() => {
    if (profile?.avatar_url) {
      const { data } = supabase.storage.from('avatars').getPublicUrl(profile.avatar_url);
      setAvatarUrl(data.publicUrl);
    } else {
      setAvatarUrl(null);
    }
  }, [profile]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md text-center">
      <img src={avatarUrl || `https://placehold.co/80x80/EFEFEF/7B7B7B?text=${profile?.full_name?.charAt(0) || '?'}`} alt="Seu avatar" className="w-20 h-20 rounded-full object-cover mx-auto mb-4 border-2 border-blue-500"/>
      <h3 className="font-bold text-lg cursor-pointer hover:underline" onClick={() => onNavigate('dashboard')}>{profile?.full_name}</h3>
      <p className="text-sm text-gray-500">{profile?.profile_type}</p>
      <div className="text-sm text-gray-600 mt-2">{profile?.sport}</div>
      <div className="text-sm text-gray-500">{profile?.city}</div>
    </div>
  );
};

const NewsWidget = () => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <h3 className="font-bold text-lg mb-4">Notícias do Esporte</h3>
    <ul className="space-y-4">
      <li className="text-sm text-gray-700 hover:text-blue-600"><a href="https://ge.globo.com/" target="_blank" rel="noopener noreferrer">Últimas notícias do ge.globo</a></li>
      <li className="text-sm text-gray-700 hover:text-blue-600"><a href="https://www.espn.com.br/" target="_blank" rel="noopener noreferrer">Destaques da ESPN Brasil</a></li>
    </ul>
  </div>
);

function FeedPage({ onNavigate, session, profile }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        let { data, error } = await supabase.from('posts').select(`*, profiles (*)`).order('created_at', { ascending: false });
        if (error) throw error;
        setPosts(data);
      } catch (error) {
        console.error('Erro ao buscar posts:', error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const handleNewPost = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  const handlePostUpdate = (updatedPost) => {
    setPosts(posts.map(p => p.id === updatedPost.id ? updatedPost : p));
  };

  return (
    <>
      {showCreatePostModal && <CreatePostModal session={session} onClose={() => setShowCreatePostModal(false)} onNewPost={handleNewPost} />}
      <div className="container mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="hidden lg:block lg:col-span-1">
            {profile && <ProfileSummaryCard profile={profile} onNavigate={onNavigate} />}
          </aside>
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-4 rounded-lg shadow-md flex items-center gap-4">
              <img src={profile?.avatar_url ? supabase.storage.from('avatars').getPublicUrl(profile.avatar_url).data.publicUrl : `https://placehold.co/50x50/EFEFEF/7B7B7B?text=${profile?.full_name?.charAt(0) || '?'}`} alt="Seu avatar" className="w-12 h-12 rounded-full object-cover"/>
              <button onClick={() => setShowCreatePostModal(true)} className="w-full text-left bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold py-3 px-4 rounded-full">
                Começar publicação
              </button>
            </div>
            {loading ? (<p>A carregar feed...</p>) : posts.length > 0 ? (posts.map(post => (<PostCard key={post.id} post={post} onNavigate={onNavigate} session={session} onPostUpdate={handlePostUpdate} />))) : (<p className="text-center text-gray-500 mt-10">Ainda não há publicações. Seja o primeiro!</p>)}
          </div>
          <aside className="hidden lg:block lg:col-span-1">
            <NewsWidget />
          </aside>
        </div>
      </div>
    </>
  );
}

export default FeedPage;
