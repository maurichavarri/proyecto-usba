export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Devuelve la URL correcta de una imagen, sea de Cloudinary o una ruta local antigua
export const urlImagen = (imagen) => {
    if (!imagen) return null;
    return imagen.startsWith('http') ? imagen : `${API_URL}${imagen}`;
};