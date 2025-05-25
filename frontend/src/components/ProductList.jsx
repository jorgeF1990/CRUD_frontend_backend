import { useEffect, useState } from "react";
import { API } from "../api/apiInstance";

const ProductList = () => {
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const res = await API.get("/products");
      setProducts(res.data);
    } catch (error) {
      console.error("Error al obtener productos:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar este producto?")) return;
    try {
      await API.delete(`/products/${id}`);
      fetchProducts();
    } catch (error) {
      console.error("Error al eliminar producto:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div>
      <h2>Lista de productos</h2>
      {products.length === 0 ? (
        <p>No hay productos</p>
      ) : (
        <ul>
          {products.map((product) => (
            <li key={product._id}>
              <strong>{product.name}</strong> - ${product.price}
              <br />
              {product.images && product.images.length > 0 && (
                <img
                  src={`http://localhost:2222${product.images[0]}`}
                  alt={product.name}
                  width="100"
                />
              )}
              <br />
              <button onClick={() => handleDelete(product._id)}>Eliminar</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProductList;
