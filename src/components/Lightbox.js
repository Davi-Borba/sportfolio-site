// src/components/Lightbox.js
import React, { useEffect } from 'react';

function Lightbox({ media, onClose }) {
  // O Hook useEffect é agora chamado no topo do componente, incondicionalmente.
  useEffect(() => {
    // A lógica do efeito só é executada se a 'media' existir.
    if (media) {
      document.body.style.overflow = 'hidden';
      // A função de limpeza é retornada para reativar o scroll quando o lightbox fecha.
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [media]); // O efeito depende da 'media'.

  // A condição para não renderizar nada permanece aqui.
  if (!media) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 text-white text-4xl"
      >
        &times;
      </button>
      <div className="max-w-4xl max-h-[90vh] p-4" onClick={(e) => e.stopPropagation()}>
        {media.type.startsWith('video') ? (
          <video controls autoPlay className="max-w-full max-h-[85vh]">
            <source src={media.url} type={media.type} />
          </video>
        ) : (
          <img src={media.url} alt={media.description} className="max-w-full max-h-[85vh] object-contain" />
        )}
        {media.description && <p className="text-white text-center mt-4">{media.description}</p>}
      </div>
    </div>
  );
}

export default Lightbox;
