import { useState } from "react";
import { API } from "../api/apiInstance";

const ProductForm = ({ onProductAdded }) => {
  const [form, setForm] = useState({ name: "", description: "", price: "", stock: "" });
  const [images, setImages] = useState([]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImages(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/products", {
        name: form.name,
        description: form.description,
        price: parseFloat(form.price),
        stock: parseInt(form.stock),
      });

      const productId = res.data._id;

      if (images.length > 0) {
        const formData = new FormData();
        for (let file of images) {
          formData.append("images", file);
        }

        await API.post(`/products/${productId}/images`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      alert("Producto agregado correctamente");
      setForm({ name: "", description: "", price: "", stock: "" });
      setImages([]);
      if (onProductAdded) onProductAdded();
    } catch (error) {
      console.error("Error al agregar producto:", error);
      alert("Error al agregar producto");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Agregar producto</h2>
      <input name="name" placeholder="Nombre" onChange={handleChange} value={form.name} required />
      <input name="description" placeholder="Descripción" onChange={handleChange} value={form.description} />
      <input name="price" type="number" placeholder="Precio" onChange={handleChange} value={form.price} required />
      <input name="stock" type="number" placeholder="Stock" onChange={handleChange} value={form.stock} />
      <input type="file" multiple onChange={handleImageChange} />
      <button type="submit">Agregar</button>
    </form>
  );
};

export default ProductForm;
