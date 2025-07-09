import { useState, useEffect, useCallback } from "react";
import { API } from "../api/apiInstance";

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/products");
      setProducts(data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar los productos");
    } finally {
      setLoading(false);
    }
  }, []);

  const createProduct = async (productData, images) => {
    try {
      setLoading(true);
      const res = await API.post("/products", productData);
      const productId = res.data._id;

      if (images.length > 0) {
        await uploadImages(productId, images);
      }

      return res.data;
    } catch (err) {
      console.error(err);
      throw new Error("Error al crear producto");
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (id, productData, images) => {
    try {
      setLoading(true);
      await API.put(`/products/${id}`, productData);

      if (images.length > 0) {
        await uploadImages(id, images);
      }

      return true;
    } catch (err) {
      console.error(err);
      throw new Error("Error al actualizar producto");
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    try {
      setLoading(true);
      await API.delete(`/products/${id}`);
      return true;
    } catch (err) {
      console.error(err);
      throw new Error("Error al eliminar producto");
    } finally {
      setLoading(false);
    }
  };

  const uploadImages = async (productId, images) => {
    const formData = new FormData();
    images.forEach(file => formData.append("images", file));

    await API.post(`/products/${productId}/images`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  };

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    loading,
    error,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct
  };
};