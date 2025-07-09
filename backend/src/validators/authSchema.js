import { z } from "zod";

const usernameSchema = z.string()
  .min(3, { message: "El nombre de usuario debe tener al menos 3 caracteres" })
  .regex(/^[a-zA-Z0-9_]+$/, {
    message: "Solo letras, números y guiones bajos permitidos"
  });

export const registerSchema = z.object({
  username: usernameSchema,
  email: z.string().email({ message: "Correo electrónico no válido" }),
  password: z.string()
    .min(6, { message: "La contraseña debe tener al menos 6 caracteres" })
    .regex(/[A-Z]/, {
      message: "Debe contener al menos una mayúscula"
    })
    .regex(/[0-9]/, {
      message: "Debe contener al menos un número"
    })
});

export const loginSchema = z.object({
  email: z.string().email({ message: "Correo electrónico no válido" }),
  password: z.string().min(1, { message: "La contraseña es obligatoria" })
});