import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImages,
} from "../controllers/productController.js";
import { storage, fileFilter } from "../config/multerConfig.js";
import multer from "multer";

const router = express.Router();

const upload = multer({
  storage,
  fileFilter,
  limits: { 
    fileSize: 10 * 1024 * 1024,
    files: 5
  }
});

const handleMulter = (req, res, next) => {
  const uploadMiddleware = upload.array("images", 5);
  
  uploadMiddleware(req, res, (err) => {
    if (err) {
      console.error("❌ Error de Multer:", err);
      
      if (err instanceof multer.MulterError) {
        let errorMessage = err.message;
        if (err.code === 'LIMIT_FILE_SIZE') {
          errorMessage = 'El archivo es demasiado grande (máx 10MB)';
        } else if (err.code === 'LIMIT_FILE_COUNT') {
          errorMessage = 'Demasiados archivos (máx 5)';
        } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
          errorMessage = 'Tipo de archivo no permitido';
        }
        return res.status(400).json({ error: errorMessage });
      }
      return res.status(500).json({ error: "Error al procesar archivos" });
    }
    
    if (req.path.includes('images') && (!req.files || req.files.length === 0)) {
      return res.status(400).json({ error: "No se subieron archivos válidos" });
    }
    
    next();
  });
};

// Rutas corregidas (sin caracteres invisibles)
router.get("/", getAllProducts);
router.post("/", authMiddleware, createProduct);
router.put("/:id", authMiddleware, updateProduct);
router.delete("/:id", authMiddleware, deleteProduct);

router.post(
  "/:id/images",
  authMiddleware,
  (req, res, next) => handleMulter(req, res, next),
  uploadProductImages
);

export { router as productRouter };