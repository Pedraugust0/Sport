import React, { useState, useEffect } from 'react'; // 🔑 Importar useEffect
import { X, ArrowLeft, Upload } from 'lucide-react';

// 🔑 Estado inicial definido fora do componente para fácil reset
const INITIAL_FORM_DATA = {
    title: '',
    description: '',
    photo: null,
    distance: '',
    duration: '',
    steps: '',
};

const CheckinModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [photoPreview, setPhotoPreview] = useState(null);

  // 🔑 FUNÇÃO DE RESET
  const resetForm = () => {
    setFormData(INITIAL_FORM_DATA);
    setPhotoPreview(null);
  };

  // 🚀 NOVO: Reseta o estado sempre que o modal for aberto
  useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  }, [isOpen]); // Depende apenas da mudança da prop isOpen

  // 🔑 FUNÇÃO UNIFICADA DE CANCELAMENTO E FECHAMENTO
  const handleCancel = () => {
    resetForm();
    onClose();
  }

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, photo: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // 🔑 ATUALIZADO: Extrai o objeto File e o passa como segundo argumento para o onSubmit
  const handleSubmit = (e) => {
    e.preventDefault();

    // 1. Extrai o File object do formData
    const photoFile = formData.photo;

    // 2. Cria um novo objeto de dados sem o File object (para limpar o JSON)
    const { photo, ...dataToSend } = formData;

    // 3. CHAMA O HANDLER EXTERNO
    onSubmit(dataToSend, photoFile);

    // 4. Resetar e Fechar usando o handler unificado
    handleCancel();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl custom-scrollbar" style={{ background: '#EDEDED' }}>
        {/* Header */}
        <div className="sticky top-0 p-6 rounded-t-3xl flex items-center" style={{ background: '#EDEDED' }}>
          <button
            // 🔑 LIGA AO HANDLER DE CANCELAMENTO
            onClick={handleCancel}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Upload Foto (Opcional) */}
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: '#212121' }}>
              Foto <span className="text-gray-400 font-normal">(opcional)</span>
            </label>
            <div className="relative">
              <input
                type="file"
                id="photo-upload"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
              <label
                htmlFor="photo-upload"
                className="flex items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:border-blue-400 transition-colors bg-gray-50 hover:bg-blue-50"
              >
                {photoPreview ? (
                  <img
                    src={photoPreview}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-2xl"
                  />
                ) : (
                  <div className="text-center">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Clique para adicionar foto</p>
                  </div>
                )}
              </label>
            </div>
          </div>

          {/* Título */}
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: '#212121' }}>
              Título da Atividade *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Ex: Corrida Matinal"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Descrição (Opcional) */}
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: '#212121' }}>
              Descrição <span className="text-gray-400 font-normal">(opcional)</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Como foi seu treino?"
              rows="3"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Métricas */}
          <div>
            <label className="block text-sm font-semibold mb-3" style={{ color: '#212121' }}>
              Métricas
            </label>
            <div className="grid grid-cols-3 gap-3">
              {/* Distância */}
              <div>
                <label className="block text-xs mb-1" style={{ color: '#212121' }}>Distância (km)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.distance}
                  onChange={(e) => setFormData({ ...formData, distance: e.target.value })}
                  placeholder="0.0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Duração */}
              <div>
                <label className="block text-xs mb-1" style={{ color: '#212121' }}>Duração (min)</label>
                <input
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  placeholder="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Passos */}
              <div>
                <label className="block text-xs mb-1" style={{ color: '#212121' }}>Passos</label>
                <input
                  type="number"
                  value={formData.steps}
                  onChange={(e) => setFormData({ ...formData, steps: e.target.value })}
                  placeholder="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Botões */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              // 🔑 LIGA AO HANDLER DE CANCELAMENTO E RESET
              onClick={handleCancel}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors font-['Shanti']"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 text-white rounded-full text-sm font-medium hover:bg-blue-700 transition-colors font-['Shanti']"
              style={{ background: '#2E67D3' }}
            >
              Publicar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckinModal;