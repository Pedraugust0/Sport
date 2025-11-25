import React, { useState, useEffect } from 'react';
import { ArrowLeft, Smile, Clock, MapPin, Footprints } from 'lucide-react';
// Importa os serviços de comentários
import { getComments, createComment, addReaction, removeReaction } from '../services/commentService';

const CheckinDetailModal = ({ isOpen, onClose, checkin, currentUser }) => {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [reactions, setReactions] = useState({});
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const availableEmojis = ['❤️', '💪', '🔥', '👏', '👍'];

  // 🆕 Carregar comentários ao abrir o modal
  useEffect(() => {
    if (isOpen && checkin && checkin.id) {
      loadComments();
    } else {
      setComments([]);
      setReactions({});
    }
  }, [isOpen, checkin]);

  const loadComments = async () => {
    try {
      const apiComments = await getComments(checkin.id);
      
      // Filtrar comentários de texto
      const textComments = apiComments
        .filter(c => c.content != null)
        .map(c => ({
            id: c.id,
            text: c.content,
            time: new Date(c.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
            user: c.user
        }));
      setComments(textComments);

      // Processar reações
      const reactionsMap = {};
      apiComments.filter(c => c.reactionEmoji != null).forEach(c => {
          reactionsMap[c.reactionEmoji] = (reactionsMap[c.reactionEmoji] || 0) + 1;
      });
      setReactions(reactionsMap);

    } catch (error) {
      console.error("Erro ao carregar comentários", error);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      // Envia para API
      await createComment(comment, checkin.id, currentUser.id);
      setComment('');
      // Recarrega para mostrar o novo
      loadComments();
    } catch (error) {
      alert("Erro ao comentar: " + error.message);
    }
  };

  const handleReaction = async (emoji) => {
    try {
      // Tenta adicionar (se já existir, o backend pode dar erro ou ignorar)
      // Aqui simplificado: tentamos adicionar. Se der erro, tentamos remover (toggle)
      // Idealmente o backend retornaria se foi adicionado ou removido.
      
      // Vamos assumir adição por enquanto para simplicidade visual
      await addReaction(emoji, checkin.id, currentUser.id);
      loadComments();
      setShowEmojiPicker(false);
    } catch (error) {
        // Se falhar (ex: já existe), tentamos remover
        try {
            await removeReaction(emoji, checkin.id, currentUser.id);
            loadComments();
            setShowEmojiPicker(false);
        } catch (e) {
            console.error("Erro ao reagir", e);
        }
    }
  };

  if (!isOpen || !checkin) return null;

  const checkinUser = checkin.user || {};
  const checkinUserName = checkinUser.name || 'Anônimo';
  const checkinUserPhoto = checkinUser.photoUrl;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden" style={{ background: '#EDEDED' }}>
        
        <div className="flex items-center justify-start p-4 pt-6" style={{ background: '#EDEDED' }}>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar px-6 pb-6">
          <div className="pb-4 pt-2">
            {checkin.photo ? (
              <img
                src={checkin.photo}
                alt={checkin.activity}
                className="w-full max-h-96 object-cover rounded-2xl"
              />
            ) : (
              <div className="w-full h-64 flex items-center justify-center rounded-2xl" style={{ background: '#2E67D3' }}>
                <span className="text-8xl">🏃</span>
              </div>
            )}
          </div>

          <div className="pb-4">
            <div className="flex items-center gap-2 mb-4">
              {checkinUserPhoto ? (
                <img 
                  src={checkinUserPhoto} 
                  alt={checkinUserName}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold" style={{ background: '#2E67D3' }}>
                  {checkinUserName.charAt(0)}
                </div>
              )}
              <div className="flex-1">
                <p className="text-sm font-medium" style={{ color: '#212121' }}>{checkinUserName}</p>
                <p className="text-xs text-gray-500">{checkin.time}</p>
              </div>
            </div>

            <h3 className="text-2xl font-bold mb-2" style={{ color: '#212121' }}>{checkin.activity}</h3>
            {checkin.description && (
              <p className="text-gray-700 mb-3">{checkin.description}</p>
            )}

            {(checkin.metrics?.distance || checkin.metrics?.duration || checkin.metrics?.steps) && (
              <div className="flex items-center gap-2 flex-wrap">
                {checkin.metrics.duration > 0 && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full">
                    <Clock className="w-5 h-5" style={{ color: '#2E67D3' }} />
                    <span className="text-sm font-medium" style={{ color: '#212121' }}>{checkin.metrics.duration} min</span>
                  </div>
                )}
                {checkin.metrics.distance > 0 && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full">
                    <MapPin className="w-5 h-5" style={{ color: '#2E67D3' }} />
                    <span className="text-sm font-medium" style={{ color: '#212121' }}>{checkin.metrics.distance} km</span>
                  </div>
                )}
                {checkin.metrics.steps > 0 && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full">
                    <Footprints className="w-5 h-5" style={{ color: '#2E67D3' }} />
                    <span className="text-sm font-medium" style={{ color: '#212121' }}>{checkin.metrics.steps} passos</span>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="py-4">
            {Object.keys(reactions).length > 0 && (
              <div className="flex items-center gap-2 flex-wrap mb-3">
                {Object.entries(reactions).map(([emoji, count]) => (
                  <button
                    key={emoji}
                    onClick={() => handleReaction(emoji)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-full text-white hover:opacity-90 transition-opacity"
                    style={{ background: '#2E67D3' }}
                  >
                    <span className="text-lg">{emoji}</span>
                    <span className="text-sm font-semibold">{count}</span>
                  </button>
                ))}
              </div>
            )}
            
            <div className="relative">
              <button
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="flex items-center gap-2 px-4 py-2 bg-white rounded-full hover:bg-gray-50 transition-colors"
              >
                <Smile className="w-5 h-5" style={{ color: '#2E67D3' }} />
              </button>

              {showEmojiPicker && (
                <div className="absolute top-12 left-0 bg-white rounded-2xl shadow-lg p-3 flex gap-2 z-10 border" style={{ borderColor: '#EDEDED' }}>
                  {availableEmojis.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => handleReaction(emoji)}
                      className="text-2xl hover:scale-125 transition-transform"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="py-4">
            {comments.length > 0 && (
              <div className="space-y-3 mb-4">
                {comments.map((c) => {
                  const commentUser = c.user || {};
                  const commentUserName = commentUser.name || 'Anônimo';
                  const commentUserPhoto = commentUser.photoUrl;

                  return (
                    <div key={c.id} className="flex gap-2 items-start">
                      {commentUserPhoto ? (
                        <img 
                          src={commentUserPhoto} 
                          alt={commentUserName}
                          className="w-7 h-7 rounded-full object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0" style={{ background: '#2E67D3' }}>
                          {commentUserName.charAt(0)}
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="text-sm">
                          <span className="font-semibold" style={{ color: '#212121' }}>{commentUserName}</span> 
                          <span className="text-gray-400 ml-1 text-xs">{c.time}</span>
                        </p>
                        <p className="text-sm mt-0.5" style={{ color: '#212121' }}>{c.text}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <form onSubmit={handleAddComment} className="flex gap-2">
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Adicione um comentário..."
                className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 transition-all"
                style={{ borderColor: '#EDEDED', backgroundColor: '#FFFFFF' }}
              />
              <button
                type="submit"
                className="px-6 py-2 text-white rounded-full font-semibold hover:opacity-90 transition-opacity"
                style={{ background: '#2E67D3' }}
              >
                Enviar
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckinDetailModal;