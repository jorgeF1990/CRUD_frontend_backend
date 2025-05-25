import React, { useState, useEffect } from "react";
import { API } from "../api/apiInstance";
import "./Dashboard.css";

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: "", description: "", price: "", stock: "" });
  const [images, setImages] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await API.get("/products");
      setProducts(data);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar los productos.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setImages(e.target.files);
  };

  const resetForm = () => {
    setForm({ name: "", description: "", price: "", stock: "" });
    setImages([]);
    setEditingId(null);
    setError("");
  };

  const handleEdit = (product) => {
    setForm({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      stock: product.stock.toString(),
    });
    setEditingId(product._id);
    setImages([]);
    setError("");
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/products/${id}`);
      fetchProducts();
    } catch (err) {
      console.error(err);
      setError("No se pudo eliminar el producto.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload = {
        ...form,
        price: parseFloat(form.price),
        stock: parseInt(form.stock),
      };

      const res = editingId
        ? await API.put(`/products/${editingId}`, payload)
        : await API.post("/products", payload);

      // Si es un nuevo producto y hay imágenes, subirlas
      if (!editingId && res?.data?._id && images.length > 0) {
        const formData = new FormData();
        Array.from(images).forEach((file) => formData.append("images", file));

        await API.post(`/products/${res.data._id}/images`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      fetchProducts();
      resetForm();
    } catch (err) {
      console.error(err);
      setError("Ocurrió un error al guardar el producto.");
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (path) => {
    const base = import.meta.env.VITE_API_BASE_URL || "http://localhost:2222";
    return `${base}${path.startsWith("/") ? path : "/" + path}`;
  };

  return (
    <div className="dashboard-container">
      <h1>Dashboard de Productos</h1>

      <form onSubmit={handleSubmit} className="dashboard-form" noValidate>
        <h2>{editingId ? "Editar producto" : "Agregar nuevo producto"}</h2>

        <input
          type="text"
          name="name"
          placeholder="Nombre"
          value={form.name}
          onChange={handleChange}
          autoComplete="name"
          required
        />
        <input
          type="text"
          name="description"
          placeholder="Descripción"
          value={form.description}
          onChange={handleChange}
          autoComplete="off"
        />
        <input
          type="number"
          name="price"
          placeholder="Precio"
          value={form.price}
          onChange={handleChange}
          autoComplete="off"
          min="0"
          step="0.01"
          required
        />
        <input
          type="number"
          name="stock"
          placeholder="Stock"
          value={form.stock}
          onChange={handleChange}
          autoComplete="off"
          min="0"
          step="1"
        />

        {!editingId && (
          <input
            type="file"
            multiple
            accept="image/jpeg,image/png,image/jpg"
            onChange={handleImageChange}
            aria-label="Seleccionar imágenes del producto"
          />
        )}

        <button type="submit" disabled={loading}>
          {loading ? "Cargando..." : editingId ? "Actualizar" : "Agregar"}
        </button>

        {editingId && (
          <button
            type="button"
            className="cancel-button"
            onClick={resetForm}
          >
            Cancelar
          </button>
        )}

        {error && <p className="error">{error}</p>}
      </form>

      <h2>Productos disponibles</h2>

      {products.length === 0 ? (
        <p>No hay productos disponibles.</p>
      ) : (
        <div className="product-list">
          {products.map((product) => (
            <div className="product-card" key={product._id}>
              <strong>{product.name}</strong>
              <p>{product.description}</p>
              <p><strong>${product.price}</strong></p>
              <p>Stock: {product.stock}</p>
              {product.images?.length > 0 ? (
                <img
                  src={getImageUrl(product.images[0])}
                  alt={`Imagen de ${product.name}`}
                  className="product-image"
                />
              ) : (
                <div className="no-image">Sin imagen</div>
              )}
              <button onClick={() => handleEdit(product)}>Editar</button>
              <button onClick={() => handleDelete(product._id)} className="delete-button">Eliminar</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
