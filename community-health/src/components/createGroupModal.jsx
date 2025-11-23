import React, { useState } from 'react';
import { ArrowLeft, Upload, Lock, Unlock } from 'lucide-react';

const CreateGroupModal = ({ isOpen, onClose, onSubmit }) => {
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [duration, setDuration] = useState('30');
  const [imagePreview, setImagePreview] = useState(null);
  const [isPrivate, setIsPrivate] = useState(false);

  React.useEffect(() => {
    if (!isOpen) {
      setImagePreview(null);
    }
  }, [isOpen]);

  const handleGroupImageChange = (e) => {
    e.stopPropagation();
    e.preventDefault();
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!groupName.trim()) {
      alert('Por favor, insira um nome para o grupo');
      return;
    }

    const groupData = {
      name: groupName,
      description: groupDescription,
      duration: parseInt(duration),
      image: imagePreview,
      isPrivate: isPrivate,
    };

    onSubmit(groupData);
    
    setGroupName('');
    setGroupDescription('');
    setDuration('30');
    setImagePreview(null);
    setIsPrivate(false);
    onClose();
  };

  const handleClose = () => {
    setGroupName('');
    setGroupDescription('');
    setDuration('30');
    setImagePreview(null);
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
                className="flex items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:border-blue-400 transition-colors bg-gray-50 hover:bg-blue-50"
              >
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-2xl"
                  />
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
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 text-white rounded-full text-sm font-medium hover:bg-blue-700 transition-colors font-['Shanti']"
              style={{ background: '#2E67D3' }}
            >
              Criar Grupo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGroupModal;