import React from "react";
import ImageManager from "./ImageManager";

const ProductForm = ({ 
  form, 
  onFormChange,
  onImageAdd,
  onImageRemove,
  onSubmit,
  onCancel,
  existingImages = [],
  newImages = [],
  loading,
  error,
  editingId
}) => {
  return (
    <form onSubmit={onSubmit} className="dashboard-form" noValidate>
      <h2>{editingId ? "Editar producto" : "Agregar nuevo producto"}</h2>
      
      <div className="form-group">
        <label htmlFor="name">Nombre *</label>
        <input
          type="text"
          id="name"
          name="name"
          placeholder="Nombre del producto"
          value={form.name}
          onChange={onFormChange}
          autoComplete="name"
          required
          disabled={loading}
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="description">Descripción</label>
        <textarea
          id="description"
          name="description"
          placeholder="Descripción del producto"
          value={form.description}
          onChange={onFormChange}
          autoComplete="off"
          disabled={loading}
          rows="3"
        />
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="price">Precio *</label>
          <input
            type="number"
            id="price"
            name="price"
            placeholder="0.00"
            value={form.price}
            onChange={onFormChange}
            autoComplete="off"
            min="0"
            step="0.01"
            required
            disabled={loading}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="stock">Stock</label>
          <input
            type="number"
            id="stock"
            name="stock"
            placeholder="0"
            value={form.stock}
            onChange={onFormChange}
            autoComplete="off"
            min="0"
            step="1"
            disabled={loading}
          />
        </div>
      </div>
      
      <ImageManager
        existingImages={existingImages}
        newImages={newImages}
        onRemoveImage={onImageRemove}
        onAddImages={onImageAdd}
        loading={loading}
      />
      
      <div className="form-actions">
        <button 
          type="submit" 
          className="primary-btn"
          disabled={loading || !form.name || !form.price}
        >
          {loading ? (
            <>
              <span className="spinner"></span>
              Procesando...
            </>
          ) : editingId ? "Actualizar producto" : "Agregar producto"}
        </button>
        
        {editingId && (
          <button
            type="button"
            className="secondary-btn"
            onClick={onCancel}
            disabled={loading}
          >
            Cancelar
          </button>
        )}
      </div>
      
      {error && <p className="error-message">{error}</p>}
    </form>
  );
};

export default ProductForm;