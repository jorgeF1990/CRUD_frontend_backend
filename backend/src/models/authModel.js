import { model, Schema } from "mongoose";

const authSchema = Schema(
  {
    username: { type: String, required: true, unique: true }, // <-- agregado
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
  },
  { versionKey: false }
);

export const User = model("User", authSchema);
