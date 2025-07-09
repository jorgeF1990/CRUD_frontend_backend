import { z } from "zod";

export const productSchema = z.object({
  name: z.string({
    required_error: "El nombre es obligatorio",
    invalid_type_error: "El nombre debe ser un texto"
  })
  .min(3, {
    message: "El nombre debe tener al menos 3 caracteres"
  })
  .max(100, {
    message: "El nombre no puede tener más de 100 caracteres"
  }),
  
  description: z.string({
    invalid_type_error: "La descripción debe ser un texto"
  })
  .max(1000, {
    message: "La descripción no puede tener más de 1000 caracteres"
  })
  .optional(),
  
  price: z.number({
    required_error: "El precio es obligatorio",
    invalid_type_error: "El precio debe ser un número"
  })
  .positive({
    message: "El precio debe ser mayor que cero"
  })
  .max(1000000, {
    message: "El precio no puede ser mayor a 1,000,000"
  }),
  
  stock: z.number({
    invalid_type_error: "El stock debe ser un número"
  })
  .int({
    message: "El stock debe ser un número entero"
  })
  .nonnegative({
    message: "El stock no puede ser negativo"
  })
  .default(0),
  
  images: z.array(z.string().url({
    message: "Las imágenes deben ser URLs válidas"
  })).optional()
});