import React, { useState } from 'react';
import { ArrowLeft, Upload, Lock, Unlock } from 'lucide-react';
// 🔑 Importar a função de upload (assumida como implementada em groupService.js)
import { uploadImage } from '../services/groupService';

const CreateGroupModal = ({ isOpen, onClose, onSubmit }) => {
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [duration, setDuration] = useState('30');
  const [imagePreview, setImagePreview] = useState(null); // String Base64 para visualização
  const [isPrivate, setIsPrivate] = useState(false);

  // 🆕 NOVO ESTADO: Armazena o objeto File real para o upload
  const [imageFile, setImageFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false); // Estado para feedback de upload

  React.useEffect(() => {
    if (!isOpen) {
      setImagePreview(null);
      setImageFile(null); // Limpa o File object ao fechar
    }
  }, [isOpen]);

  // 🔑 ATUALIZADO: Salva o objeto File real no estado (para uso no handleSubmit)
  const handleGroupImageChange = (e) => {
    e.stopPropagation();
    e.preventDefault();
    const file = e.target.files[0];
    if (file) {
      setImageFile(file); // 🔑 Salva o objeto File

      // Lógica de visualização (Base64)
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // 🔑 ATUALIZADO: Gerencia a sequência de Upload (MultiPart) -> Criação (JSON)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!groupName.trim()) {
      alert('Por favor, insira um nome para o grupo');
      return;
    }

    let finalImageUrl = null;
    setIsUploading(true);

    // 1. FAZER UPLOAD SE HOUVER UM ARQUIVO SELECIONADO
    if (imageFile) {
        try {
            // Chama a API de upload MultiPart (retorna a URL real)
            finalImageUrl = await uploadImage(imageFile);
        } catch (uploadError) {
            setIsUploading(false);
            alert(`Falha crítica ao carregar imagem: ${uploadError.message}. O grupo não será criado.`);
            return; // Interrompe a criação do grupo se o upload falhar
        }
    }

    // 2. CRIAR O OBJETO DE DADOS FINAL COM A URL OBTIDA
    const groupData = {
      name: groupName,
      description: groupDescription,
      duration: parseInt(duration),
      imageUrl: finalImageUrl, // 🔑 ENVIA A URL REAL para o GroupController (Backend)
      isPrivate: isPrivate,
    };

    // 3. Submete os dados limpos (JSON) para a criação do grupo
    onSubmit(groupData);

    // Limpeza de estado local
    setIsUploading(false);
    handleClose(); // Chama o método de fechamento que limpa o estado
  };

  const handleClose = () => {
    setGroupName('');
    setGroupDescription('');
    setDuration('30');
    setImagePreview(null);
    setImageFile(null); // Limpeza adicional do File object
    setIsPrivate(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl custom-scrollbar" style={{ background: '#EDEDED' }}>
        <div className="sticky top-0 p-6 rounded-t-3xl flex items-center" style={{ background: '#EDEDED' }}>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: '#212121' }}>
              Imagem do Grupo <span className="text-gray-400 font-normal">(opcional)</span>
            </label>
            <div className="relative">
              <input
                type="file"
                id="create-group-image-input"
                accept="image/*"
                onChange={handleGroupImageChange}
                className="hidden"
                key={isOpen ? 'open' : 'closed'}
              />
              <label
                htmlFor="create-group-image-input"
                className={`flex items-center justify-center w-full h-40 border-2 border-dashed rounded-2xl cursor-pointer transition-colors
                  ${isUploading ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400 bg-gray-50 hover:bg-blue-50'}`
                }
              >
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-2xl"
                  />
                ) : isUploading ? ( // Feedback de Carregamento
                    <div className="text-center">
                        <p className="text-sm font-semibold text-blue-700">Fazendo Upload...</p>
                    </div>
                ) : (
                  <div className="text-center">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Clique para adicionar imagem</p>
                  </div>
                )}
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: '#212121' }}>
              Nome do Grupo *
            </label>
            <input
              type="text"
              required
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Ex: Operação Foco Total"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isUploading}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: '#212121' }}>
              Descrição <span className="text-gray-400 font-normal">(opcional)</span>
            </label>
            <textarea
              value={groupDescription}
              onChange={(e) => setGroupDescription(e.target.value)}
              placeholder="Descreva o objetivo do grupo..."
              rows="3"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              disabled={isUploading}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: '#212121' }}>
              Duração (dias) *
            </label>
            <input
              type="number"
              required
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              min="1"
              max="365"
              placeholder="30"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isUploading}
            />
            <p className="text-xs text-gray-500 mt-1">Entre 1 e 365 dias</p>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-3" style={{ color: '#212121' }}>
              Privacidade
            </label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setIsPrivate(false)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  !isPrivate
                    ? 'bg-blue-50 border-2 border-blue-500'
                    : 'border-2 border-gray-200 hover:border-gray-300'
                }`}
                disabled={isUploading}
              >
                <Unlock
                  className="w-5 h-5"
                  style={{ color: !isPrivate ? '#2E67D3' : '#6B7280' }}
                />
                <span
                  className="text-sm font-medium"
                  style={{ color: !isPrivate ? '#2E67D3' : '#6B7280' }}
                >
                  Pública
                </span>
              </button>
              <button
                type="button"
                onClick={() => setIsPrivate(true)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  isPrivate
                    ? 'bg-blue-50 border-2 border-blue-500'
                    : 'border-2 border-gray-200 hover:border-gray-300'
                }`}
                disabled={isUploading}
              >
                <Lock
                  className="w-5 h-5"
                  style={{ color: isPrivate ? '#2E67D3' : '#6B7280' }}
                />
                <span
                  className="text-sm font-medium"
                  style={{ color: isPrivate ? '#2E67D3' : '#6B7280' }}
                >
                  Privada
                </span>
              </button>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors font-['Shanti']"
              disabled={isUploading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 text-white rounded-full text-sm font-medium hover:bg-blue-700 transition-colors font-['Shanti']"
              style={{ background: '#2E67D3' }}
              disabled={isUploading} // Desabilita o botão enquanto o upload está em andamento
            >
              {isUploading ? 'Carregando...' : 'Criar Grupo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGroupModal;