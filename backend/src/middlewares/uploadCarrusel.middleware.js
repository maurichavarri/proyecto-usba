import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, '../../uploads/carrusel');

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `carrusel-${Date.now()}${ext}`);
    }
});

const fileFilter = (req, file, cb) => {
    const valido = /jpeg|jpg|png|webp|gif/.test(
        path.extname(file.originalname).toLowerCase()
    );
    valido
        ? cb(null, true)
        : cb(new Error('Solo se permiten imágenes (jpg, png, webp, gif)'));
};

const uploadCarrusel = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }
});

export default uploadCarrusel;