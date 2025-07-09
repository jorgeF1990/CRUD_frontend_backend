import React from "react";
import { getImageUrl } from "./ImageManager";

const ProductList = ({ 
  products, 
  onEdit, 
  onDelete, 
  searchTerm, 
  onSearchChange,
  currentPage,
  totalPages,
  onPageChange
}) => {
  return (
    <div className="product-list-container">
      <div className="product-list-header">
        <h2>Productos disponibles</h2>
        
        <div className="search-container">
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={onSearchChange}
          />
          <span className="search-icon">🔍</span>
        </div>
      </div>
      
      {products.length === 0 ? (
        <div className="empty-state">
          <p>No se encontraron productos</p>
        </div>
      ) : (
        <>
          <div className="product-grid">
            {products.map((product) => (
              <div className="product-card" key={product._id}>
                <div className="product-header">
                  <h3>{product.name}</h3>
                  <p className="product-price">${product.price.toFixed(2)}</p>
                </div>
                
                <p className="product-description">
                  {product.description || "Sin descripción"}
                </p>
                
                <div className="product-details">
                  <span className="stock-badge">
                    {product.stock > 0 
                      ? `Stock: ${product.stock}` 
                      : "Agotado"}
                  </span>
                </div>
                
                {product.images?.length > 0 ? (
                  <div className="product-images">
                    {product.images.slice(0, 3).map((img) => (
                      <img
                        key={`${product._id}-${img}`}
                        src={getImageUrl(img)}
                        alt={`Imagen de ${product.name}`}
                        className="product-image"
                      />
                    ))}
                    {product.images.length > 3 && (
                      <div className="image-count">
                        +{product.images.length - 3}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="no-image">Sin imágenes</div>
                )}
                
                <div className="product-actions">
                  <button 
                    onClick={() => onEdit(product)}
                    className="edit-btn"
                  >
                    Editar
                  </button>
                  <button 
                    onClick={() => onDelete(product._id)}
                    className="delete-btn"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {totalPages > 1 && (
            <div className="pagination">
              <button 
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                &lt; Anterior
              </button>
              <span>Página {currentPage} de {totalPages}</span>
              <button 
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                Siguiente &gt;
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProductList;