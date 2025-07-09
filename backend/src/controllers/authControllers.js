import { User } from "../models/authModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { registerSchema, loginSchema } from "../validators/authSchema.js";
import dotenv from "dotenv";

dotenv.config();

export const register = async (req, res) => {
  const { username, email, password } = req.body;

  const validation = registerSchema.safeParse({ username, email, password });
  if (!validation.success) {
    return res.status(400).json({ error: validation.error.issues });
  }

  try {
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ error: "El correo o nombre de usuario ya están registrados." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

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

export const login = async (req, res) => {
  const { email, password } = req.body;

  const validation = loginSchema.safeParse({ email, password });
  if (!validation.success) {
    return res.status(400).json({ error: validation.error.issues });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Credenciales inválidas." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Credenciales inválidas." });
    }

    if (!process.env.JWT_SECRET) {
      console.error("ERROR: JWT_SECRET no está definido");
      return res.status(500).json({ error: "Error de configuración del servidor" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h"
    });

    res.json({ 
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username
      }
    });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ error: "Error en el servidor." });
  }
};