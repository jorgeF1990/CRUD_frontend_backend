import React, { useState, useEffect, useCallback } from "react";
import ProductForm from "../components/ProductForm";
import ProductList from "../components/ProductList";
import { useProducts } from "../hooks/useProducts";
import "./Dashboard.css";

const Dashboard = () => {
  const { 
    products, 
    loading, 
    error: productsError, 
    createProduct, 
    updateProduct, 
    deleteProduct,
    fetchProducts 
  } = useProducts();
  
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [form, setForm] = useState({ 
    name: "", 
    description: "", 
    price: "", 
    stock: "" 
  });
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formError, setFormError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6;
  
  // Función para normalizar URLs de imágenes
  const normalizeImageUrl = useCallback((imgPath) => {
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
  }, []);

  // Filtrar productos según término de búsqueda
  useEffect(() => {
    const filtered = products.map(product => ({
      ...product,
      // Normalizar URLs de imágenes
      images: product.images ? 
        product.images.map(img => normalizeImageUrl(img)) : 
        []
    }));
    
    const searched = filtered.filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    
    setFilteredProducts(searched);
    setCurrentPage(1); // Resetear a primera página al buscar
  }, [products, searchTerm, normalizeImageUrl]);

  // Calcular productos paginados
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  // Manejar cambios en el formulario
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // Manejar selección de imágenes
  const handleImageAdd = (e) => {
    const files = Array.from(e.target.files).slice(0, 5);
    setNewImages(prev => [...prev, ...files]);
  };

  // Eliminar imagen (existente o nueva)
  const handleImageRemove = (image, isNew = false) => {
    if (isNew) {
      setNewImages(prev => prev.filter(img => img !== image));
    } else {
      setExistingImages(prev => prev.filter(img => img !== image));
    }
  };

  // Resetear formulario
  const resetForm = () => {
    setForm({ name: "", description: "", price: "", stock: "" });
    setExistingImages([]);
    setNewImages([]);
    setEditingId(null);
    setFormError("");
  };

  // Preparar formulario para edición
  const handleEdit = (product) => {
    setForm({
      name: product.name,
      description: product.description || "",
      price: product.price.toString(),
      stock: product.stock?.toString() || "",
    });
    
    // Normalizar URLs de imágenes existentes
    const normalizedImages = product.images 
      ? product.images.map(img => normalizeImageUrl(img))
      : [];
    
    setExistingImages(normalizedImages);
    setNewImages([]);
    setEditingId(product._id);
    setFormError("");
    
    // Scroll al formulario
    document.querySelector('.dashboard-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Eliminar producto
  const handleDelete = async (id) => {
    if (!window.confirm("¿Está seguro que desea eliminar este producto? Esta acción no se puede deshacer.")) {
      return;
    }
    
    try {
      await deleteProduct(id);
      fetchProducts();
    } catch (err) {
      setFormError("No se pudo eliminar el producto. Intente de nuevo.");
    }
  };

  // Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    // Validaciones básicas
    if (!form.name.trim() || !form.price) {
      setFormError("Nombre y precio son campos obligatorios");
      return;
    }

    try {
      const productData = {
        ...form,
        price: parseFloat(form.price),
        stock: parseInt(form.stock) || 0,
        images: existingImages
      };

      if (editingId) {
        await updateProduct(editingId, productData, newImages);
      } else {
        await createProduct(productData, newImages);
      }

      // Actualizar lista y resetear formulario
      fetchProducts();
      resetForm();
    } catch (err) {
      setFormError("Ocurrió un error al guardar el producto: " + (err.message || "Intente de nuevo"));
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Panel de Gestión de Productos</h1>
        <p>Administra el catálogo de productos de tu tienda</p>
      </header>

      <div className="dashboard-content">
        <ProductForm 
          form={form}
          onFormChange={handleFormChange}
          onImageAdd={handleImageAdd}
          onImageRemove={handleImageRemove}
          onSubmit={handleSubmit}
          onCancel={resetForm}
          existingImages={existingImages}
          newImages={newImages}
          loading={loading}
          error={formError || productsError}
          editingId={editingId}
        />

        <ProductList 
          products={currentProducts}
          onEdit={handleEdit}
          onDelete={handleDelete}
          searchTerm={searchTerm}
          onSearchChange={(e) => setSearchTerm(e.target.value)}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default Dashboard;