import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: "Token de autenticación requerido" });
  }

  const token = authHeader.split(' ')[1];

  if (!process.env.JWT_SECRET) {
    console.error("ERROR: JWT_SECRET no está definido");
    return res.status(500).json({ error: "Error de configuración del servidor" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.error("Error de autenticación:", error.message);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: "Token expirado" });
    }
    
    res.status(401).json({ error: "Token inválido" });
  }
};