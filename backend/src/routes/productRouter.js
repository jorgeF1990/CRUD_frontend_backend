import express from "express";
import multer from "multer";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImages,
} from "../controllers/productController.js";

// ✅ Importa configuración desde un solo lugar
import { storage, fileFilter } from "../config/multerConfig.js";

const router = express.Router();

// 📂 Configura Multer
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

// 📦 Rutas
router.get("/", getAllProducts);
router.post("/", authMiddleware, createProduct);
router.put("/:id", authMiddleware, updateProduct);
router.delete("/:id", authMiddleware, deleteProduct);

router.post(
  "/:id/images",
  authMiddleware,
  upload.array("images", 5),
  uploadProductImages
);

export { router as productRouter };
