import { connect } from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const URI_DB = process.env.URI_DB;

const connectDb = async () => {
  try {
    await connect(URI_DB, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log("✅ Conectado a MongoDB con éxito");
  } catch (error) {
    console.error("❌ Error al conectarse a MongoDB:");
    console.error(error.message);
    
    if (error.name === 'MongoNetworkError') {
      console.error("Posibles causas:");
      console.error("1. MongoDB no está corriendo");
      console.error("2. La URI de conexión es incorrecta");
      console.error("3. Problemas de red/firewall");
    }
    
    process.exit(1);
  }
};

export { connectDb };