import React from 'react';
import './ProductCard.css';

const ProductCard = ({ product, onClick }) => {
  // Función para obtener todas las imágenes válidas
  const getValidImages = () => {
    if (!product.images || product.images.length === 0) return [];
    
    // Si es una cadena (por compatibilidad con datos antiguos)
    if (typeof product.images === 'string') {
      return product.images.split(',').map(img => img.trim()).filter(img => img);
    }
    
    // Si es un array, devolverlo
    if (Array.isArray(product.images)) {
      return product.images;
    }
    
    return [];
  };

  // Función para normalizar la URL de la imagen
  const normalizeImageUrl = (imgPath) => {
    if (!imgPath) return null;
    
    // Si ya es una URL completa, no hacer cambios
    if (/^https?:\/\//.test(imgPath)) {
      return imgPath;
    }
    
    // Construir URL completa basada en la ubicación del backend
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:2222';
    
    // Manejar rutas que ya empiezan con '/'
    if (imgPath.startsWith('/')) {
      return `${baseUrl}${imgPath}`;
    }
    
    return `${baseUrl}/${imgPath}`;
  };

  const images = getValidImages();
  const firstImage = images.length > 0 ? images[0] : null;
  const normalizedImage = firstImage ? normalizeImageUrl(firstImage) : null;

  return (
    <div
      className="product-card"
      onClick={onClick}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      role="button"
      aria-label={`Ver detalles de ${product.name}`}
    >
      <div className="product-image-container">
        {normalizedImage ? (
          <>
            <img 
              src={normalizedImage} 
              alt={product.name} 
              className="product-image"
              loading="lazy"
              onError={(e) => {
                e.target.onerror = null;
                e.target.className = "product-image-placeholder";
                e.target.parentNode.innerHTML = '<div class="product-image-placeholder"><span>Imagen no disponible</span></div>';
              }}
            />
            {images.length > 1 && (
              <div className="image-count-badge">
                +{images.length - 1}
              </div>
            )}
          </>
        ) : (
          <div className="product-image-placeholder">
            <span>Sin imagen disponible</span>
          </div>
        )}
      </div>
      
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-description">
          {product.description || "Sin descripción disponible"}
        </p>
        <div className="product-meta">
          <span className="product-price">${product.price.toFixed(2)}</span>
          <span className={`product-stock ${product.stock <= 5 ? 'low-stock' : ''}`}>
            {product.stock > 0 ? `${product.stock} disponibles` : ''}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;