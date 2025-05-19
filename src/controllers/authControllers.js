// 1 - sanitizar los datos de entrada
// {
//   "name": 1 -> name debería ser un string, rechazo la req
// }
// 2 - responderle al cliente
// 3 - responder al cliente siempre con la misma data (JSON)
import { User } from "../models/authModel.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
process.loadEnvFile()

export const register = async (req, res) => {
  try {
    const { username, password } = req.body
    // encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = new User({ username, password: hashedPassword })
    await newUser.save()
    res.json(newUser)
  } catch (error) {
    res.status(400).json({ error: "el usuario ya existe" })
  }
}

export const login = async (req, res) => {
  const { username, password } = req.body

  const user = await User.findOne({ username })
  if (!user) res.status(401).json({ error: "credenciales invalidas" })

  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) return res.status(401).json({ error: "credenciales invalidas" })

  // payload, clave secreta y cuando expira
  const JWT_SECRET = process.env.JWT_SECRET
  const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "1h" })
  res.json({ token })
}

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODExMGMzMjQwNDNiMjdiNTJmYWM0NGIiLCJpYXQiOjE3NDU5NDg2MDksImV4cCI6MTc0NTk1MjIwOX0.8U9G8ULShneJZ7aYzxPL641HUPZ60dpY1Qds9k6-oP4