import React from "react";

export const getImageUrl = (path) => {
  const base = import.meta.env.VITE_API_BASE_URL || "http://localhost:2222";
  return `${base}${path.startsWith("/") ? path : "/" + path}`;
};

const ImageManager = ({ 
  existingImages = [], 
  newImages = [], 
  onRemoveImage,
  onAddImages,
  loading
}) => {
  return (
    <div className="form-group">
      <label>Imágenes</label>
      
      {/* Imágenes existentes */}
      {existingImages.length > 0 && (
        <div className="existing-images">
          <h4>Imágenes existentes:</h4>
          <div className="image-preview-container">
            {existingImages.map((img) => (
              <div key={`existing-${img}`} className="image-preview">
                <img src={getImageUrl(img)} alt="Imagen existente" />
                <button 
                  type="button" 
                  className="remove-image-btn"
                  onClick={() => onRemoveImage(img, false)}
                  disabled={loading}
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Nuevas imágenes */}
      {newImages.length > 0 && (
        <div className="new-images">
          <h4>Nuevas imágenes:</h4>
          <div className="image-preview-container">
            {newImages.map((file) => (
              <div key={`new-${file.name}-${file.size}`} className="image-preview">
                <img src={URL.createObjectURL(file)} alt="Nueva imagen" />
                <button 
                  type="button" 
                  className="remove-image-btn"
                  onClick={() => onRemoveImage(file, true)}
                  disabled={loading}
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Input para nuevas imágenes */}
      <div className="file-input-container">
        <label htmlFor="images" className="file-input-label">
          <span>+ Seleccionar imágenes</span>
          <input
            type="file"
            id="images"
            multiple
            accept="image/jpeg,image/png,image/jpg"
            onChange={onAddImages}
            aria-label="Seleccionar imágenes"
            disabled={loading}
          />
        </label>
        <p className="file-input-hint">Máximo 5 imágenes (JPEG, PNG)</p>
      </div>
    </div>
  );
};

export default ImageManager;