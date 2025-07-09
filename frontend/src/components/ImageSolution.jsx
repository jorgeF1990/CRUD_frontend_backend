import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ImageSolution = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulación de llamada a la API para obtener imágenes
    const fetchImages = async () => {
      try {
        // En una aplicación real, esta sería tu URL de API
        const response = await axios.get('https://picsum.photos/v2/list?limit=4');
        setImages(response.data);
        setLoading(false);
      } catch (err) {
        setError('Error al cargar las imágenes. Por favor, inténtalo de nuevo.');
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 max-w-md mx-auto mt-10" role="alert">
        <p className="font-bold">Error</p>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-16">
          <h1 className="text-4xl font-bold text-indigo-800 mb-4">Solución a Errores de Imágenes</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Esta página demuestra cómo resolver el error 404 cuando las imágenes no se cargan correctamente.
          </p>
        </header>

        <div className="bg-white rounded-xl shadow-xl p-8 mb-16">
          <h2 className="text-2xl font-bold text-indigo-700 mb-6">Causas comunes del error 404</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <div className="bg-indigo-50 p-6 rounded-lg">
              <div className="bg-indigo-200 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <span className="text-indigo-800 font-bold">1</span>
              </div>
              <h3 className="font-bold text-lg text-indigo-800 mb-2">Rutas incorrectas</h3>
              <p className="text-gray-700">
                Las imágenes se suben a una carpeta diferente a donde el servidor está buscando.
              </p>
            </div>
            
            <div className="bg-indigo-50 p-6 rounded-lg">
              <div className="bg-indigo-200 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <span className="text-indigo-800 font-bold">2</span>
              </div>
              <h3 className="font-bold text-lg text-indigo-800 mb-2">Configuración del servidor</h3>
              <p className="text-gray-700">
                Falta configurar Express para servir archivos estáticos desde la carpeta de uploads.
              </p>
            </div>
            
            <div className="bg-indigo-50 p-6 rounded-lg">
              <div className="bg-indigo-200 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <span className="text-indigo-800 font-bold">3</span>
              </div>
              <h3 className="font-bold text-lg text-indigo-800 mb-2">Permisos de archivos</h3>
              <p className="text-gray-700">
                El servidor no tiene permisos para acceder a los archivos en la carpeta de uploads.
              </p>
            </div>
            
            <div className="bg-indigo-50 p-6 rounded-lg">
              <div className="bg-indigo-200 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <span className="text-indigo-800 font-bold">4</span>
              </div>
              <h3 className="font-bold text-lg text-indigo-800 mb-2">URLs incorrectas</h3>
              <p className="text-gray-700">
                La aplicación cliente está usando una URL diferente a la configurada en el servidor.
              </p>
            </div>
          </div>
          
          <h3 className="text-xl font-bold text-indigo-700 mb-4">Solución para Express:</h3>
          <div className="bg-gray-800 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto mb-6">
            {`const express = require('express');
const path = require('path');
const app = express();

// Configuración para servir archivos estáticos desde la carpeta 'uploads'
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Asegúrate de que la carpeta 'uploads' exista
// y tenga los permisos adecuados

app.listen(2222, () => {
  console.log('Servidor ejecutándose en http://localhost:2222');
});`}
          </div>
          
          <div className="bg-green-50 border-l-4 border-green-500 p-4">
            <p className="text-green-700">
              <span className="font-bold">Nota:</span> Después de implementar esta solución, las imágenes estarán accesibles en:
              <code className="block mt-2 bg-gray-100 p-2 rounded">http://localhost:2222/uploads/nombre-del-archivo.png</code>
            </p>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-indigo-700 mb-6">Imágenes cargadas correctamente</h2>
          <p className="text-gray-600 mb-6">
            Estas imágenes se cargan dinámicamente desde una API externa para demostrar la solución funcional.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {images.map((image) => (
              <div key={image.id} className="bg-gray-50 rounded-lg overflow-hidden shadow-md transition-transform hover:scale-105">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={`https://picsum.photos/id/${image.id}/300/200`} 
                    alt={image.author} 
                    className="w-full h-full object-cover transition-opacity hover:opacity-90"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-800 truncate">Imagen de {image.author}</h3>
                  <p className="text-gray-600 text-sm mt-1">Dimensiones: {image.width}×{image.height}</p>
                  <a 
                    href={image.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block mt-3 text-sm text-indigo-600 hover:text-indigo-800"
                  >
                    Ver original
                  </a>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-10 p-6 bg-indigo-50 rounded-lg">
            <h3 className="font-bold text-indigo-800 text-lg mb-3">Verificación de solución</h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              <li>Las imágenes se cargan sin errores 404</li>
              <li>La ruta del servidor coincide con la URL solicitada</li>
              <li>La carpeta de uploads existe y tiene los archivos necesarios</li>
              <li>El servidor tiene permisos para acceder a los archivos</li>
            </ul>
          </div>
        </div>
        
        <footer className="mt-16 text-center text-gray-600">
          <p>© {new Date().getFullYear()} Solución de Errores de Imágenes. Todos los derechos reservados.</p>
        </footer>
      </div>
    </div>
  );
};

export default ImageSolution;