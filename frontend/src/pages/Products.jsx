import { useEffect, useState, useCallback } from "react";
import { API } from "../api/apiInstance";
import ProductCard from "../components/ProductCard";
import "./Products.css";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await API.get("/products");
      
      // Construir URLs correctas para las imágenes
      const correctedProducts = res.data.map(product => {
        if (!product.images || product.images.length === 0) return product;
        
        const correctedImages = product.images.map(img => {
          if (img.startsWith('http')) return img;
          return `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:2222'}${img.startsWith('/') ? img : '/' + img}`;
        });
        
        return {
          ...product,
          images: correctedImages
        };
      });
      
      setProducts(correctedProducts);
    } catch (err) {
      console.error("Error al obtener productos:", err);
      setError("No se pudieron cargar los productos. Inténtalo de nuevo más tarde.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleAddToCart = useCallback((product) => {
    console.log("Producto agregado al carrito:", product);
    alert(`"${product.name}" agregado al carrito.`);
  }, []);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setCurrentImageIndex(0);
    document.body.style.overflow = 'hidden'; // Deshabilitar scroll del body
  };

  const handleClosePopup = () => {
    setSelectedProduct(null);
    document.body.style.overflow = 'auto'; // Habilitar scroll del body
  };

  const handlePrevImage = () => {
    setCurrentImageIndex(prev => 
      prev === 0 ? selectedProduct.images.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex(prev => 
      prev === selectedProduct.images.length - 1 ? 0 : prev + 1
    );
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p className="message">Cargando productos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error">{error}</p>
        <button onClick={fetchProducts} className="retry-button">
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="products-page">
      <h1 className="page-title">Nuestros Productos</h1>
      
      {products.length > 0 ? (
        <div className="products-container">
          {products.map((product) => (
            <ProductCard 
              key={product._id} 
              product={product} 
              onClick={() => handleProductClick(product)}
            />
          ))}
        </div>
      ) : (
        <div className="empty-container">
          <p className="message">No hay productos disponibles en este momento.</p>
          <button onClick={fetchProducts} className="retry-button">
            Recargar productos
          </button>
        </div>
      )}

      {/* Popup de detalles del producto */}
      {selectedProduct && (
        <div className="product-popup-overlay" onClick={handleClosePopup}>
          <div className="product-popup" onClick={(e) => e.stopPropagation()}>
            <button className="close-popup" onClick={handleClosePopup}>
              &times;
            </button>
            
            <div className="popup-content">
              <div className="popup-images">
                {selectedProduct.images && selectedProduct.images.length > 0 && (
                  <>
                    <div className="main-image-container">
                      <img 
                        src={selectedProduct.images[currentImageIndex]} 
                        alt={selectedProduct.name} 
                        className="main-image"
                      />
                      
                      {selectedProduct.images.length > 1 && (
                        <>
                          <button 
                            className="image-nav prev" 
                            onClick={handlePrevImage}
                            aria-label="Imagen anterior"
                          >
                            &lt;
                          </button>
                          <button 
                            className="image-nav next" 
                            onClick={handleNextImage}
                            aria-label="Siguiente imagen"
                          >
                            &gt;
                          </button>
                        </>
                      )}
                    </div>
                    
                    {selectedProduct.images.length > 1 && (
                      <div className="thumbnails">
                        {selectedProduct.images.map((img, index) => (
                          <img
                            key={index}
                            src={img}
                            alt={`Miniatura ${index + 1}`}
                            className={`thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                            onClick={() => setCurrentImageIndex(index)}
                          />
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
              
              <div className="popup-details">
                <h2 className="product-title">{selectedProduct.name}</h2>
                
                <div className="product-price">
                  ${selectedProduct.price.toFixed(2)}
                  {selectedProduct.discountPercentage > 0 && (
                    <span className="discount-badge">
                      {selectedProduct.discountPercentage}% OFF
                    </span>
                  )}
                </div>
                
                <div className="product-meta">
                  <span className="stock-info">
                    {selectedProduct.stock > 0 
                      ? `En stock: ${selectedProduct.stock} unidades` 
                      : 'Agotado'}
                  </span>
                  <span className="rating">
                    {Array(5).fill().map((_, i) => (
                      <span 
                        key={i} 
                        className={`star ${i < Math.floor(selectedProduct.rating) ? 'filled' : ''}`}
                      >
                        ★
                      </span>
                    ))}
                    ({selectedProduct.rating})
                  </span>
                </div>
                
                <div className="product-description">
                  <h3>Descripción</h3>
                  <p>{selectedProduct.description || "Este producto no tiene descripción disponible."}</p>
                </div>
                
                <div className="product-actions">
                  <button 
                    className="add-to-cart-btn"
                    onClick={() => {
                      handleAddToCart(selectedProduct);
                      handleClosePopup();
                    }}
                    disabled={selectedProduct.stock <= 0}
                  >
                    {selectedProduct.stock > 0 
                      ? "Agregar al carrito" 
                      : "Producto agotado"}
                  </button>
                </div>
                
                <div className="product-specs">
                  <h3>Especificaciones</h3>
                  <ul>
                    {selectedProduct.brand && <li><strong>Marca:</strong> {selectedProduct.brand}</li>}
                    {selectedProduct.category && <li><strong>Categoría:</strong> {selectedProduct.category}</li>}
                    {selectedProduct.weight && <li><strong>Peso:</strong> {selectedProduct.weight}</li>}
                    {selectedProduct.dimensions && <li><strong>Dimensiones:</strong> {selectedProduct.dimensions}</li>}
                    <li><strong>SKU:</strong> {selectedProduct._id}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;