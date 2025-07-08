// src/components/CreatePostModal.js
import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

function CreatePostModal({ session, onClose, onNewPost }) {
  const [content, setContent] = useState('');
  const [mediaFile, setMediaFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() && !mediaFile) {
      alert("A publicação não pode estar vazia.");
      return;
    }

    setLoading(true);
    let mediaPublicUrl = null;

    try {
      if (mediaFile) {
        const fileName = `${session.user.id}/${Date.now()}.${mediaFile.name.split('.').pop()}`;
        const { error: uploadError } = await supabase.storage.from('media').upload(fileName, mediaFile);
        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from('media').getPublicUrl(fileName);
        mediaPublicUrl = data.publicUrl;
      }

      const { data: postData, error: postError } = await supabase
        .from('posts')
        .insert({ 
          content: content, 
          author_id: session.user.id,
          media_url: mediaPublicUrl,
          media_type: mediaFile ? mediaFile.type : null,
          likes: [],
          comments: []
        })
        .select(`*, profiles (*)`)
        .single();

      if (postError) throw postError;

      alert('Publicação criada com sucesso!');
      onNewPost(postData);
      onClose();

    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h2 className="text-xl font-bold text-gray-800">Criar Publicação</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
        </div>
        <form onSubmit={handlePostSubmit}>
          <textarea
            className="w-full p-3 border-none rounded-md text-lg focus:ring-0"
            rows="6"
            placeholder="Sobre o que você quer falar?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          ></textarea>
          <div className="flex justify-between items-center mt-4">
            <div>
              <label htmlFor="post-media" className="cursor-pointer text-blue-600 hover:text-blue-800 p-2 rounded-full hover:bg-blue-50">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>
              </label>
              <input id="post-media" type="file" className="hidden" onChange={(e) => setMediaFile(e.target.files[0])} accept="image/*,video/*"/>
              {mediaFile && <span className="ml-2 text-sm text-gray-500">{mediaFile.name}</span>}
            </div>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 disabled:bg-gray-400"
              disabled={loading || (!content.trim() && !mediaFile)}
            >
              {loading ? 'A publicar...' : 'Publicar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreatePostModal;
