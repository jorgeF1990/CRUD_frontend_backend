import React, { useEffect, useState } from 'react';

const ProductDetailModal = ({ product, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loadingImage, setLoadingImage] = useState(true);

  const getSafeImageUrl = (imagePath) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    return `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:2222'}${imagePath}`;
  };

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  useEffect(() => {
    setCurrentImageIndex(0);
    setLoadingImage(true);
  }, [product]);

  const handleImageChange = (index) => {
    setCurrentImageIndex(index);
    setLoadingImage(true);
  };

  const safeImages = product.images?.map(getSafeImageUrl) || [];

  return (
    <div 
      className="popup-overlay" 
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-modal-title"
    >
      <div
        className="popup-content"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="close-btn"
          onClick={onClose}
          aria-label="Cerrar detalles del producto"
        >
          &times;
        </button>
        
        <div className="product-detail-container">
          <div className="product-detail-images">
            {safeImages.length > 0 ? (
              <div className="image-gallery">
                <div className="main-image-container">
                  {loadingImage && (
                    <div className="image-loading">
                      <div className="spinner"></div>
                    </div>
                  )}
                  <img 
                    src={safeImages[currentImageIndex]} 
                    alt={product.name} 
                    className={`main-image ${loadingImage ? 'hidden' : ''}`}
                    onLoad={() => setLoadingImage(false)}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.classList.add('hidden');
                      setLoadingImage(false);
                    }}
                  />
                </div>
                
                {safeImages.length > 1 && (
                  <div className="thumbnail-container">
                    {safeImages.map((img, idx) => (
                      <div 
                        key={idx} 
                        className={`thumbnail ${currentImageIndex === idx ? 'active' : ''}`}
                        onClick={() => handleImageChange(idx)}
                      >
                        <img 
                          src={img} 
                          alt={`Vista ${idx + 1} de ${product.name}`} 
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.style.display = 'none';
                            e.target.parentNode.innerHTML = '<div class="thumbnail-error">!</div>';
                          }}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="image-placeholder">
                <span>Imagen no disponible</span>
              </div>
            )}
          </div>
          
          <div className="product-detail-info">
            <h2 id="product-modal-title">{product.name}</h2>
            
            <div className="product-detail-meta">
              <div className="meta-item">
                <span className="meta-label">Precio:</span>
                <span className="meta-value price">${product.price.toFixed(2)}</span>
              </div>
              
              <div className="meta-item">
                <span className="meta-label">Disponibilidad:</span>
                <span className={`meta-value ${product.stock <= 5 ? 'low-stock' : ''}`}>
                  {product.stock > 0 
                    ? `${product.stock} unidades disponibles` 
                    : 'Producto agotado'}
                </span>
              </div>
              
              <div className="meta-item">
                <span className="meta-label">Categoría:</span>
                <span className="meta-value category">{product.category || 'Sin categoría'}</span>
              </div>
            </div>
            
            <div className="description-container">
              <h3 className="description-title">Descripción</h3>
              <p className="product-detail-description">
                {product.description || "Este producto no tiene descripción."}
              </p>
            </div>
            
            <div className="action-buttons">
              <button 
                className="add-to-cart-btn" 
                disabled={product.stock === 0}
                aria-label="Añadir al carrito"
              >
                {product.stock > 0 ? 'Añadir al carrito' : 'Agotado'}
              </button>
              <button 
                className="wishlist-btn"
                aria-label="Guardar en favoritos"
              >
                Guardar en favoritos
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;