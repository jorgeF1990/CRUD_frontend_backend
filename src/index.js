import express from "express";
import dotenv from "dotenv";
import { connectDb } from "./config/mongo.js";
import { authRouter } from "./routes/authRouter.js";

// Cargar variables de entorno
dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();


// Middleware para manejar JSON (opcional, pero útil)
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader) return res.status(401).json({ error: "token requerido" })

  const token = authHeader.split(" ")[1]

  try {
    const JWT_SECRET = process.env.JWT_SECRET
    console.log(JWT_SECRET)

    const decoded = jwt.verify(token, JWT_SECRET)
    req.userId = decoded.userId
    console.log(req.userId)
    next()
  } catch (error) {
    res.status(401).json({ error: 'Token inválido' });
  }
}

app.use(express.json());

app.get("/api/profile",authMiddleware, (req, res) => {
 //ver el perfil del usuario logueado
  res.json({ loggedUser: req.userId });
});

// input -> /products /auth /sales /providers /users
// Ejemplo: http://localhost:1234/api/auth
app.use("/api/auth", authRouter);

// Conectar a la DB y arrancar el servidor
app.listen(PORT, () => {
  connectDb();
  console.log(`Servidor corriendo en el puerto http://localhost:${PORT}`);
});






