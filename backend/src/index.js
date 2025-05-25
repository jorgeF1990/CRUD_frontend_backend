import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import { connectDb } from "./config/mongo.js";
import { authRouter } from "./routes/authRouter.js";
import { userRouter } from "./routes/userRouter.js";
import { productRouter } from "./routes/productRouter.js";

dotenv.config();
const PORT = process.env.PORT || 2222;
const app = express();

// __dirname para ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configura CORS
const allowedOrigins = ["http://localhost:5173", "http://localhost:5174","http://localhost:5175","http://localhost:3000"];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true); // permite peticiones sin origen (ej: Postman)
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("No permitido por CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));


// Middleware para parsear JSON
app.use(express.json());

// Servir archivos estáticos (imágenes)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Rutas API
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/products", productRouter);

// Endpoint para testear servidor
app.get("/ping", (req, res) => {
  res.json({ message: "pong" });
});

// Conectar a Mongo y arrancar servidor
connectDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error("Error al conectar a MongoDB:", err);
    process.exit(1);
  });
