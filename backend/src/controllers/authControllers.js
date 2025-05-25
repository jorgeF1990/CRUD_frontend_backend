import { User } from "../models/authModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { registerSchema, loginSchema } from "../validators/authSchema.js";
import dotenv from "dotenv";

dotenv.config();

// Registro
export const register = async (req, res) => {
  const { username, email, password } = req.body;

  // Validación con Zod
  const validation = registerSchema.safeParse({ username, email, password });
  if (!validation.success) {
    return res.status(400).json({ error: validation.error.issues });
  }

  try {
    // Verificar existencia de usuario por email o username
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ error: "El correo o nombre de usuario ya están registrados." });
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear nuevo usuario
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({
      message: "Usuario creado con éxito",
      user: {
        email: newUser.email,
        username: newUser.username
      }
    });
  } catch (error) {
    console.error("Error en el registro:", error);
    res.status(500).json({ error: "Error en el servidor." });
  }
};

// Login
export const login = async (req, res) => {
  const { email, password } = req.body;

  // Validación con Zod
  const validation = loginSchema.safeParse({ email, password });
  if (!validation.success) {
    return res.status(400).json({ error: validation.error.issues });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Credenciales inválidas." });
    }

    // Comparar contraseña
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Credenciales inválidas." });
    }

    // Generar token JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h"
    });

    res.json({ token });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ error: "Error en el servidor." });
  }
};
