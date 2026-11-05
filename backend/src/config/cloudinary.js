import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

// Sube un buffer de imagen a Cloudinary y devuelve la URL pública
export const subirImagen = (buffer, carpeta = 'usba') =>
    new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder: carpeta },
            (error, result) => {
                if (error) return reject(error);
                resolve(result.secure_url);
            }
        );
        stream.end(buffer);
    });

// Borra una imagen de Cloudinary a partir de su URL
export const eliminarImagen = async (url) => {
    if (!url || !url.includes('res.cloudinary.com')) return;

    // Extrae el public_id: por ejemplo, "usba/anuncios/abc123"
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-z0-9]+$/i);
    if (!match) return;

    await cloudinary.uploader.destroy(match[1]);
};

export default cloudinary;