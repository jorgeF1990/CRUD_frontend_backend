import { Product } from "../models/Product.js";
import { productSchema } from "../validators/productSchema.js";
import fs from 'fs';
import path from 'path';

// Función para normalizar imágenes (nueva)
const normalizeImages = (images) => {
  if (!images) return [];
  
  // Si es string, intentar convertirlo a array
  if (typeof images === 'string') {
    try {
      // Intentar parsear si es un string JSON
      return JSON.parse(images);
    } catch (e) {
      // Si falla, dividir por comas
      return images.split(',').map(img => img.trim()).filter(img => img);
    }
  }
  
  // Si ya es array, devolverlo
  if (Array.isArray(images)) {
    return images;
  }
  
  // Cualquier otro caso, devolver array vacío
  return [];
};

// Función para formatear URLs de imágenes (modificada)
const formatImageUrls = (req, images) => {
  const normalizedImages = normalizeImages(images);
  
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  return normalizedImages.map(img => {
    // Si la imagen ya es una URL absoluta, la dejamos tal cual
    if (/^https?:\/\//.test(img)) {
      return img;
    }
    // Si la ruta relativa no empieza con '/', se la agregamos
    const normalizedPath = img.startsWith('/') ? img : `/${img}`;
    return `${baseUrl}${normalizedPath}`;
  });
};

const getAllProducts = async (req, res) => {
  try {
    console.log("Obteniendo productos de la base de datos...");
    const products = await Product.find();
    console.log(`Productos encontrados: ${products.length}`);
    
    const formattedProducts = products.map(product => {
      console.log(`Procesando producto: ${product.name}`);
      console.log(`Imágenes originales: ${product.images}`);
      
      const formatted = {
        _id: product._id,
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        images: formatImageUrls(req, product.images),
        createdAt: product.createdAt,
        updatedAt: product.updatedAt
      };
      
      console.log(`Imágenes formateadas: ${formatted.images}`);
      return formatted;
    });
    
    res.json(formattedProducts);
  } catch (err) {
    console.error("🚨 Error al obtener productos:", err);
    res.status(500).json({ 
      error: "Error interno del servidor",
      ...(process.env.NODE_ENV === 'development' && { 
        details: err.message,
        stack: err.stack 
      })
    });
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock } = req.body;
    
    // Validación con Zod
    const validation = productSchema.safeParse({
      name,
      description: description || "",
      price: parseFloat(price),
      stock: parseInt(stock) || 0
    });
    
    if (!validation.success) {
      console.log("Validación fallida:", validation.error.issues);
      return res.status(400).json({ error: validation.error.issues });
    }

    // Manejar archivos subidos
    const images = req.files?.map(file => `/uploads/${file.filename}`) || [];
    console.log("Archivos subidos:", images);

    const newProduct = new Product({
      ...validation.data,
      images
    });
    
    await newProduct.save();
    console.log("Producto creado:", newProduct);
    
    const responseProduct = {
      ...newProduct.toObject({ virtuals: false }),
      images: formatImageUrls(req, newProduct.images)
    };
    
    res.status(201).json(responseProduct);
  } catch (err) {
    console.error("🚨 Error al crear producto:", err);
    res.status(500).json({ 
      error: "Error interno del servidor",
      ...(process.env.NODE_ENV === 'development' && { 
        details: err.message,
        stack: err.stack 
      })
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    console.log(`Actualizando producto ID: ${id}`, updateData);

    // Validación con Zod (parcial, solo los campos presentes)
    const validation = productSchema.partial().safeParse(updateData);
    if (!validation.success) {
      console.log("Validación fallida:", validation.error.issues);
      return res.status(400).json({ error: validation.error.issues });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id, 
      validation.data, 
      { new: true, runValidators: true }
    );
    
    if (!updatedProduct) {
      console.log(`Producto no encontrado: ${id}`);
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    console.log("Producto actualizado:", updatedProduct);
    const responseProduct = {
      ...updatedProduct.toObject({ virtuals: false }),
      images: formatImageUrls(req, updatedProduct.images)
    };
    
    res.json(responseProduct);
  } catch (err) {
    console.error("🚨 Error al actualizar producto:", err);
    res.status(500).json({ 
      error: "Error interno del servidor",
      ...(process.env.NODE_ENV === 'development' && { 
        details: err.message,
        stack: err.stack 
      })
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Eliminando producto ID: ${id}`);
    
    const deleted = await Product.findByIdAndDelete(id);
    
    if (!deleted) {
      console.log(`Producto no encontrado para eliminar: ${id}`);
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    // Eliminar imágenes físicas
    const images = normalizeImages(deleted.images);
    images.forEach(imagePath => {
      if (imagePath) {
        const filename = path.basename(imagePath);
        const filePath = path.join(__dirname, '..', '..', 'uploads', filename);
        
        if (fs.existsSync(filePath)) {
          fs.unlink(filePath, (err) => {
            if (err) console.error(`Error al eliminar ${filePath}:`, err);
          });
        }
      }
    });

    console.log("Producto eliminado:", deleted);
    res.json({ message: "Producto eliminado" });
  } catch (err) {
    console.error("🚨 Error al eliminar producto:", err);
    res.status(500).json({ 
      error: "Error interno del servidor",
      ...(process.env.NODE_ENV === 'development' && { 
        details: err.message,
        stack: err.stack 
      })
    });
  }
};

const uploadProductImages = async (req, res) => {
  const productId = req.params.id;
  console.log(`Subiendo imágenes para producto ID: ${productId}`);

  try {
    if (!req.files || req.files.length === 0) {
      console.log("No se subieron archivos");
      return res.status(400).json({ error: "No se subieron imágenes" });
    }

    const files = req.files.map(file => `/uploads/${file.filename}`);
    console.log("Archivos subidos:", files);
    
    const product = await Product.findById(productId);
    
    if (!product) {
      console.log(`Producto no encontrado: ${productId}`);
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    // Normalizar imágenes existentes y agregar nuevas
    const existingImages = normalizeImages(product.images);
    const newImages = [...new Set([...existingImages, ...files])]; // Eliminar duplicados
    
    product.images = newImages;
    await product.save();
    console.log("Imágenes agregadas al producto:", product.images);

    res.status(200).json({
      message: "Imágenes subidas correctamente",
      images: formatImageUrls(req, product.images)
    });
  } catch (err) {
    console.error("🚨 Error al subir imágenes:", err);
    res.status(500).json({ 
      error: "Error interno del servidor",
      ...(process.env.NODE_ENV === 'development' && { 
        details: err.message,
        stack: err.stack 
      })
    });
  }
};

export {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImages
};