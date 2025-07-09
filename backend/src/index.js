import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import multer from "multer";

import { connectDb } from "./config/mongo.js";
import { authRouter } from "./routes/authRouter.js";
import { userRouter } from "./routes/userRouter.js";
import { productRouter } from "./routes/productRouter.js";

// Configuración inicial
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '.env') });

// Validación de puerto
let PORT = process.env.PORT ? parseInt(process.env.PORT) : 2222; // Cambiado a 2222
if (isNaN(PORT) || PORT < 1024 || PORT > 65535) {
  console.warn('⚠️ Puerto inválido. Usando puerto 2222');
  PORT = 2222;
}

const app = express();

// IMPORTANTE: Configuración corregida de uploads
const uploadsDir = path.join(__dirname, 'uploads'); // Corregido el path
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log(`📁 Carpeta 'uploads' creada en: ${uploadsDir}`);
}

// Configuración de CORS mejorada
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`⚠️ Origen bloqueado por CORS: ${origin}`);
      callback(new Error('Origen no permitido por CORS'));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Middlewares
app.use(express.json());
app.use("/uploads", express.static(uploadsDir)); // Servir archivos estáticos

// Logging de solicitudes
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Rutas
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/products", productRouter);

// Ruta de prueba
app.get("/ping", (req, res) => {
  res.json({ 
    message: "pong", 
    timestamp: new Date(),
    server: "Backend API",
    version: "1.0.0"
  });
});

// IMPORTANTE: Ruta adicional para servir archivos con extensión
app.get('/uploads/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(uploadsDir, filename);
  
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).json({ error: 'Archivo no encontrado' });
  }
});

// Manejo de errores
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: err.message });
  }
  
  console.error('❌ ERROR:', err.stack);
  
  res.status(500).json({ 
    error: 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && {
      message: err.message,
      stack: err.stack
    })
  });
});

// Conectar DB e iniciar servidor
connectDb()
  .then(() => {
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`\n🚀 Servidor corriendo en http://localhost:${PORT}`);
      console.log(`🔐 JWT Secret: ${process.env.JWT_SECRET ? 'Configurado' : 'ERROR!'}`);
      console.log(`🗄️  MongoDB URI: ${process.env.URI_DB}`);
      console.log(`📁 Ruta de uploads: ${uploadsDir}`);
      console.log(`🌐 Orígenes permitidos: ${allowedOrigins.join(', ')}`);
      console.log("============================================\n");
    });

    server.on('error', (err) => {
      console.error('\n❌ ERROR AL INICIAR SERVIDOR:');
      console.error(`Código: ${err.code}`);
      console.error(`Mensaje: ${err.message}`);
      
      if (err.code === 'EACCES') {
        console.error(`\nSOLUCIÓN: Ejecuta con un puerto diferente (ej: 2222)`);
        console.error(`Modifica el archivo .env con: PORT=2222\n`);
      } else if (err.code === 'EADDRINUSE') {
        console.error(`\nSOLUCIÓN: El puerto ${PORT} está en uso`);
        console.error(`1. Encuentra el proceso: netstat -ano | findstr :${PORT}`);
        console.error(`2. Mata el proceso: taskkill /PID [PID] /F\n`);
      }
      
      process.exit(1);
    });
  })
  .catch(err => {
    console.error("❌ Error al conectar a MongoDB:", err);
    process.exit(1);
  });