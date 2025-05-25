import React, { useEffect, useState } from "react";
import { API } from "../api/apiInstance";
import "./Home.css";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await API.get("/products");
        setProducts(res.data);
      } catch (err) {
        console.error("Error al cargar productos:", err);
        setError("No se pudieron cargar los productos");
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="home-container">
      {error && <div className="error-message">{error}</div>}

      {products.length === 0 && !error && (
        <p className="no-products">No hay productos disponibles</p>
      )}

      <div className="product-grid">
        {products.map((p) => (
          <div
            key={p._id}
            className="product-card"
            onClick={() => setSelectedProduct(p)}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter") setSelectedProduct(p);
            }}
            role="button"
            aria-label={`Ver detalles de ${p.name}`}
          >
            <h3>{p.name}</h3>
            <p className="product-description">{p.description}</p>
            <p className="product-price">Precio: ${p.price}</p>
            <p className="product-stock">Stock: {p.stock}</p>
          </div>
        ))}
      </div>

      {selectedProduct && (
        <div className="popup-overlay" onClick={() => setSelectedProduct(null)}>
          <div
            className="popup-content"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="popup-title"
          >
            <button
              className="close-btn"
              onClick={() => setSelectedProduct(null)}
              aria-label="Cerrar popup"
            >
              &times;
            </button>
            <h2 id="popup-title">{selectedProduct.name}</h2>
            <p>{selectedProduct.description}</p>
            <p><strong>Precio:</strong> ${selectedProduct.price}</p>
            <p><strong>Stock:</strong> {selectedProduct.stock}</p>
            {/* Si tienes imágenes, podés agregar aquí */}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
