import { Product } from "../models/Product.js";

// Obtener todos los productos
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    console.error("Error al obtener productos:", err);
    res.status(500).json({ error: "Error al obtener productos" });
  }
};

// Crear producto
const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock } = req.body;

    if (!name || !price) {
      return res.status(400).json({ error: "El nombre y el precio son obligatorios" });
    }

    const priceNumber = parseFloat(price);
    const stockNumber = parseInt(stock || 0);

    if (isNaN(priceNumber) || isNaN(stockNumber)) {
      return res.status(400).json({ error: "Precio o stock inválido" });
    }

    const newProduct = new Product({
      name,
      description,
      price: priceNumber,
      stock: stockNumber,
      images: [],
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    console.error("Error al crear producto:", err);
    res.status(500).json({ error: "Error al crear producto" });
  }
};

// Editar producto
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    if (updateData.price !== undefined) {
      const price = parseFloat(updateData.price);
      if (isNaN(price)) return res.status(400).json({ error: "Precio inválido" });
      updateData.price = price;
    }

    if (updateData.stock !== undefined) {
      const stock = parseInt(updateData.stock);
      if (isNaN(stock)) return res.status(400).json({ error: "Stock inválido" });
      updateData.stock = stock;
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedProduct) return res.status(404).json({ error: "Producto no encontrado" });

    res.json(updatedProduct);
  } catch (err) {
    console.error("Error al actualizar producto:", err);
    res.status(500).json({ error: "Error al actualizar producto" });
  }
};

// Eliminar producto
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: "Producto no encontrado" });

    res.json({ message: "Producto eliminado" });
  } catch (err) {
    console.error("Error al eliminar producto:", err);
    res.status(500).json({ error: "Error al eliminar producto" });
  }
};

// Subir imágenes
const uploadProductImages = async (req, res) => {
  const productId = req.params.id;

  try {
    const files = req.files.map(file => `/uploads/products/${file.filename}`);
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Producto no encontrado" });

    product.images = [...product.images, ...files];
    await product.save();

    res.status(200).json({ message: "Imágenes subidas correctamente", images: product.images });
  } catch (err) {
    console.error("Error al subir imágenes:", err);
    res.status(500).json({ message: "Error al subir imágenes" });
  }
};

// Exportaciones
export {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImages
};
