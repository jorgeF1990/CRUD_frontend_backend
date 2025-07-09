import { User } from "../models/authModel.js";

export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Error en servidor' });
  }
};