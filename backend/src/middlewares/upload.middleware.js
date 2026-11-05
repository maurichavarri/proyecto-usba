import multer from 'multer';
import path from 'path';

const tiposPermitidos = /jpeg|jpg|png|webp|gif/;

const fileFilter = (req, file, cb) => {
    const esValido = tiposPermitidos.test(
        path.extname(file.originalname).toLowerCase()
    );
    if (esValido) {
        cb(null, true);
    } else {
        cb(new Error('Solo se permiten imágenes (jpg, png, webp, gif)'));
    }
};

const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // máximo 5MB
});

export default upload;