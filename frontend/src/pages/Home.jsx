import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { API } from "../api/apiInstance";
import ProductCard from "../components/ProductCard";
import ProductDetailModal from "../components/ProductDetailModal";
import SearchBar from "../components/SearchBar";
import "./Home.css";

const MAX_RETRIES = 3;
const RETRY_DELAY = 3000;

const Home = () => {
  const [allProducts, setAllProducts] = useState([]); // Todos los productos
  const [filteredProducts, setFilteredProducts] = useState([]); // Productos filtrados
  const [randomProducts, setRandomProducts] = useState([]); // Productos aleatorios
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [retryCount, setRetryCount] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const location = useLocation();
  const navigate = useNavigate();

  const carouselImages = [
    "/carousel/logo.PNG",
    
  ];

  // Función para obtener productos
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await API.get("/products");
      
      const productsWithCorrectedImages = res.data.map(product => {
        if (!product.images || product.images.length === 0) return product;
        
        const correctedImages = product.images.map(img => {
          if (img.startsWith('http')) return img;
          return `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:2222'}${img}`;
        });
        
        return {
          ...product,
          images: correctedImages
        };
      });
      
      setAllProducts(productsWithCorrectedImages);
      setRetryCount(0);
    } catch (err) {
      console.error("Error al cargar productos:", err);
      
      let errorMessage = "No se pudieron cargar los productos";
      
      if (err.isNetworkError) {
        errorMessage = "Error de red. Verifique su conexión a internet";
      } else if (err.response?.status === 500) {
        errorMessage = "Error en el servidor. Por favor intente más tarde";
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      
      localStorage.setItem(
        "lastApiError", 
        JSON.stringify({
          timestamp: new Date().toISOString(),
          error: {
            message: err.message,
            status: err.response?.status,
          }
        })
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // Filtrar productos basado en el término de búsqueda
  useEffect(() => {
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const filtered = allProducts.filter(product => 
        product.name.toLowerCase().includes(term) || 
        (product.description && product.description.toLowerCase().includes(term))
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts([]);
    }
  }, [searchTerm, allProducts]);

  // Seleccionar 3 productos aleatorios cuando no hay búsqueda
  useEffect(() => {
    if (allProducts.length > 0 && !searchTerm) {
      const shuffled = [...allProducts].sort(() => 0.5 - Math.random());
      setRandomProducts(shuffled.slice(0, 3));
    }
  }, [allProducts, searchTerm]);

  // Efecto para cargar productos
  useEffect(() => {
    const controller = new AbortController();
    fetchProducts();
    return () => controller.abort();
  }, [fetchProducts]);

  // Efecto para manejar parámetros de búsqueda en la URL
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get('search');
    if (searchQuery) {
      setSearchTerm(searchQuery);
    }
  }, [location.search]);

  // Efecto para reintentos automáticos
  useEffect(() => {
    if (error && retryCount < MAX_RETRIES) {
      const timerId = setTimeout(() => {
        setRetryCount(prev => prev + 1);
        fetchProducts();
      }, RETRY_DELAY);

      return () => clearTimeout(timerId);
    }
  }, [error, retryCount, fetchProducts]);

  // Efecto para el carrusel automático
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === carouselImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Manejar búsqueda
  const handleSearch = (term) => {
    setSearchTerm(term);
    navigate(term ? `/home?search=${encodeURIComponent(term)}` : '/home');
  };

  // Manejar cierre del modal
  const handleCloseModal = useCallback(() => {
    setSelectedProduct(null);
  }, []);

  // Determinar qué productos mostrar
  const productsToShow = searchTerm ? filteredProducts : randomProducts;
  const showRandomProducts = !searchTerm && randomProducts.length > 0;
  const showNoProducts = !loading && !error && productsToShow.length === 0;

  return (
    <div className="home-container">
      {/* Carrusel de imágenes */}
      <div className="image-carousel">
        <div className="carousel-container">
          {carouselImages.map((img, index) => (
            <div 
              key={index}
              className={`carousel-slide ${index === currentImageIndex ? 'active' : ''}`}
            >
              <img 
                src={img} 
                alt={`Imagen del carrusel ${index + 1}`} 
                className="carousel-image"
              />
            </div>
          ))}
          
          <button 
            className="carousel-btn prev"
            onClick={() => setCurrentImageIndex(prev => 
              prev === 0 ? carouselImages.length - 1 : prev - 1
            )}
            aria-label="Imagen anterior"
          >
            ‹
          </button>
          <button 
            className="carousel-btn next"
            onClick={() => setCurrentImageIndex(prev => 
              (prev + 1) % carouselImages.length
            )}
            aria-label="Imagen siguiente"
          >
            ›
          </button>
          
          <div className="carousel-indicators">
            {carouselImages.map((_, index) => (
              <button
                key={index}
                className={`indicator ${index === currentImageIndex ? 'active' : ''}`}
                onClick={() => setCurrentImageIndex(index)}
                aria-label={`Ir a imagen ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Barra de búsqueda */}
      <div className="search-section">
        <SearchBar 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onSearchSubmit={handleSearch}
          placeholder="Buscar productos por nombre o descripción..."
        />
      </div>

      {/* Estado de carga */}
      {loading && (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Cargando productos...</p>
          {retryCount > 0 && (
            <p className="retry-info">
              (Reintento {retryCount}/{MAX_RETRIES})
            </p>
          )}
        </div>
      )}

      {/* Manejo de errores */}
      {error && !loading && (
        <div className="error-container">
          <div className="error-message">{error}</div>
          
          <div className="error-details">
            {retryCount >= MAX_RETRIES ? (
              <p>Se agotaron los reintentos automáticos</p>
            ) : (
              <p>Reintentando automáticamente en {RETRY_DELAY/1000} segundos...</p>
            )}
          </div>
          
          <button 
            className="retry-button"
            onClick={() => {
              setRetryCount(0);
              fetchProducts();
            }}
            aria-label="Reintentar cargar productos"
          >
            Reintentar ahora
          </button>
          
          <p className="error-tip">
            Si el problema persiste, contacte al soporte técnico
          </p>
        </div>
      )}

      {/* Sin productos */}
      {showNoProducts && (
        <div className="no-products-container">
          <p className="no-products-message">
            {searchTerm 
              ? `No se encontraron productos para "${searchTerm}"` 
              : "Actualmente no hay productos disponibles"}
          </p>
          <button 
            className="retry-button"
            onClick={fetchProducts}
            aria-label="Recargar productos"
          >
            Recargar productos
          </button>
        </div>
      )}

      {/* Lista de productos */}
      {!loading && !error && productsToShow.length > 0 && (
        <>
          <div className="product-grid">
            {productsToShow.map(product => (
              <ProductCard
                key={product._id}
                product={product}
                onClick={() => setSelectedProduct(product)}
              />
            ))}
          </div>

          {/* Botón "Ver más" solo cuando no hay búsqueda */}
          {showRandomProducts && (
            <div className="see-more-container">
              <button 
                className="see-more-button"
                onClick={() => navigate("/products")}
              >
                Ver más productos
              </button>
            </div>
          )}
        </>
      )}

      {/* Modal de detalle de producto */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default Home;