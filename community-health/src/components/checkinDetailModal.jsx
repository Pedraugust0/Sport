import React, { useState, useEffect } from 'react';
import { ArrowLeft, MessageCircle, Smile, Clock, MapPin, Footprints } from 'lucide-react';
// 🔑 Importar a função de busca para carregar dados existentes
import { getCommentsByCheckinId } from '../services/groupService';

import daviPhoto from '../imagens/Davi.jpeg';

// Recebe as props de API: onCreateComment (envio)
const CheckinDetailModal = ({ isOpen, onClose, checkin, onCreateComment }) => { // 🔑 Recebe onCreateComment

  const [commentText, setCommentText] = useState(''); // Renomeado para evitar conflito com 'comment' da prop
  const [comments, setComments] = useState([]);
  const [reactions, setReactions] = useState({}); // Estado das reações vindas do backend
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [loadingComments, setLoadingComments] = useState(false); // Novo estado de carregamento

  const availableEmojis = ['❤️', '💪', '🔥', '👏', '👍'];

  // -------------------------------------------------------------
  // FUNÇÃO DE SINCRONIZAÇÃO: Carrega dados do Backend
  // -------------------------------------------------------------
  const loadInitialData = async (checkinId) => {
    if (!checkinId) return;

    setLoadingComments(true);
    try {
        const fetchedComments = await getCommentsByCheckinId(checkinId);

        // 1. Processar Reações
        const newReactions = {};
        let commentIdCounter = Date.now(); // Para garantir chaves únicas no mock

        // Filtra para separar reações de comentários de texto
        const textComments = fetchedComments.filter(c => {
            if (c.reactionEmoji) {
                // Conta as reações (se o backend salvar cada reação como um objeto Comment)
                newReactions[c.reactionEmoji] = (newReactions[c.reactionEmoji] || 0) + 1;
                return false; // É uma reação, não um comentário de texto
            }
            return true; // É um comentário de texto
        });

        setReactions(newReactions);

        // 2. Mapear Comentários de Texto
        const mappedComments = textComments.map((c) => ({
            id: c.id, // ID real do backend
            user: c.user ? c.user.name : 'Membro',
            text: c.content,
            time: new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            userPhoto: daviPhoto, // Mock até ter a foto do user real
        })).sort((a, b) => new Date(a.time) - new Date(b.time)); // Ordena para cronologia

        setComments(mappedComments);

    } catch (error) {
        console.error("Erro ao carregar dados do Check-in:", error);
    } finally {
        setLoadingComments(false);
    }
  };

  // -------------------------------------------------------------
  // EFEITO: CARREGAR DADOS NA ABERTURA/TROCA DE CHECK-IN
  // -------------------------------------------------------------
  useEffect(() => {
    if (isOpen && checkin?.apiId) {
      loadInitialData(checkin.apiId);
      setCommentText('');
      // ⚠️ IMPORTANTE: Se o checkin.apiId não estiver sendo passado na key do componente pai,
      // este useEffect precisa lidar com a limpeza manual se a prop 'checkin' mudar.
    } else {
        // Limpar estados ao fechar o modal
        setComments([]);
        setReactions({});
    }
  }, [isOpen, checkin?.apiId]); // 🔑 Depende da abertura e do ID do Check-in

  // -------------------------------------------------------------
  // FUNÇÕES DE SUBMISSÃO (Integração com a API)
  // -------------------------------------------------------------

  // 🔑 Substitui handleAddComment: Envio de Comentário de Texto
  const handleSendComment = async (e) => {
    e.preventDefault();
    if (commentText.trim() === '' || loadingComments || !checkin?.apiId) return;

    try {
        const newCommentApi = await onCreateComment(
            checkin.apiId,
            commentText,
            null // Não é uma reação de emoji
        );

        // Mapeia o objeto retornado pela API para a UI e adiciona localmente
        const newCommentForUI = {
            id: newCommentApi.id,
            user: newCommentApi.user ? newCommentApi.user.name : 'Você', // Deve ser o nome do usuário logado
            text: newCommentApi.content,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            userPhoto: daviPhoto,
        };

        setComments(prev => [...prev, newCommentForUI]);
        setCommentText('');

    } catch (error) {
        alert('Falha ao enviar comentário.');
        console.error(error);
    }
  };

  // 🔑 Substitui handleReaction: Envio de Reação/Emoji
  const handleSendReaction = async (emoji) => {
    if (loadingComments || !checkin?.apiId) return;

    try {
        // Envia a reação (Conteúdo nulo, apenas emoji)
        await onCreateComment(checkin.apiId, null, emoji);

        // Atualiza o estado local para dar feedback imediato
        setReactions(prev => ({
            ...prev,
            [emoji]: (prev[emoji] || 0) + 1,
        }));

        setShowEmojiPicker(false);

    } catch (error) {
        alert('Falha ao enviar reação.');
        console.error(error);
    }
  };

  // -------------------------------------------------------------

  if (!isOpen || !checkin) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden" style={{ background: '#EDEDED' }}>
        {/* Header */}
        <div className="flex items-center justify-start p-4 pt-6" style={{ background: '#EDEDED' }}>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Conteúdo com scroll */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-6 pb-6">
          {/* Foto do Check-in com bordas arredondadas */}
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

          {/* Informações do usuário e horário */}
          <div className="pb-4">
            <div className="flex items-center gap-2 mb-4">
              {checkin.userPhoto ? (
                <img
                  src={checkin.userPhoto}
                  alt={checkin.user.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold" style={{ background: '#2E67D3' }}>
                  {checkin.user.name.charAt(0)}
                </div>
              )}
              <div className="flex-1">
                <p className="text-sm font-medium" style={{ color: '#212121' }}>{checkin.user.name}</p>
                <p className="text-xs text-gray-500">{checkin.time}</p>
              </div>
            </div>

            {/* Título e descrição */}
            <h3 className="text-2xl font-bold mb-2" style={{ color: '#212121' }}>{checkin.activity}</h3>
            {checkin.description && (
              <p className="text-gray-700 mb-3">{checkin.description}</p>
            )}

            {/* Métricas do Check-in */}
            {(checkin.metrics?.duration || checkin.metrics?.distance || checkin.metrics?.steps) && (
              <div className="flex items-center gap-2 flex-wrap">
                {checkin.metrics.duration && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full">
                    <Clock className="w-5 h-5" style={{ color: '#2E67D3' }} />
                    <span className="text-sm font-medium" style={{ color: '#212121' }}>{checkin.metrics.duration}</span>
                  </div>
                )}
                {checkin.metrics.distance && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full">
                    <MapPin className="w-5 h-5" style={{ color: '#2E67D3' }} />
                    <span className="text-sm font-medium" style={{ color: '#212121' }}>{checkin.metrics.distance}</span>
                  </div>
                )}
                {checkin.metrics.steps && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full">
                    <Footprints className="w-5 h-5" style={{ color: '#2E67D3' }} />
                    <span className="text-sm font-medium" style={{ color: '#212121' }}>{checkin.metrics.steps}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Reações */}
          <div className="py-4">
            {/* Mostrar reações existentes */}
            {Object.keys(reactions).length > 0 && (
              <div className="flex items-center gap-2 flex-wrap mb-3">
                {Object.entries(reactions).map(([emoji, count]) => (
                  <button
                    key={emoji}
                    // ⚠️ Nota: Clicar aqui deve remover a reação, mas por simplicidade, apenas chama o handler.
                    onClick={() => handleSendReaction(emoji)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-full text-white hover:opacity-90 transition-opacity"
                    style={{ background: '#2E67D3' }}
                  >
                    <span className="text-lg">{emoji}</span>
                    <span className="text-sm font-semibold">{count}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Botão de reagir */}
            <div className="relative">
              <button
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="flex items-center gap-2 px-4 py-2 bg-white rounded-full hover:bg-gray-50 transition-colors"
              >
                <Smile className="w-5 h-5" style={{ color: '#2E67D3' }} />
              </button>

              {/* Picker de emojis */}
              {showEmojiPicker && (
                <div className="absolute top-12 left-0 bg-white rounded-2xl shadow-lg p-3 flex gap-2 z-10 border" style={{ borderColor: '#EDEDED' }}>
                  {availableEmojis.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => handleSendReaction(emoji)} // 🔑 Chama a função de envio de reação
                      className="text-2xl hover:scale-125 transition-transform"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Comentários */}
          <div className="py-4">
            {/* Lista de comentários */}
            {loadingComments ? (
                <p className="text-gray-500 text-sm">Carregando comentários...</p>
            ) : comments.length > 0 ? (
                <div className="space-y-3 mb-4">
                    {comments.map((c) => (
                        <div key={c.id} className="flex gap-2 items-start">
                            {c.userPhoto ? (
                            <img
                                src={c.userPhoto}
                                alt={c.user}
                                className="w-7 h-7 rounded-full object-cover flex-shrink-0"
                            />
                            ) : (
                            <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0" style={{ background: '#2E67D3' }}>
                                {c.user.charAt(0)}
                            </div>
                            )}
                            <div className="flex-1">
                            <p className="text-sm">
                                <span className="font-semibold" style={{ color: '#212121' }}>{c.user}</span>
                                <span className="text-gray-400 ml-1 text-xs">{c.time}</span>
                            </p>
                            <p className="text-sm mt-0.5" style={{ color: '#212121' }}>{c.text}</p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500 text-sm">Nenhum comentário ainda.</p>
            )}
          </div>
        </div>

        {/* Adicionar comentário (Rodapé) */}
        <form onSubmit={handleSendComment} className="flex gap-2 p-4 border-t" style={{ background: '#FFFFFF' }}>
          <input
            type="text"
            value={commentText} // 🔑 Usando commentText
            onChange={(e) => setCommentText(e.target.value)}
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
  );
};

export default CheckinDetailModal;