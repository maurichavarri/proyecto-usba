import { Router } from 'express';
import { getBienvenida, actualizarBienvenida } from '../controllers/bienvenida.controller.js';
import verifyToken from '../middlewares/verifyToken.js';
import verifyRole from '../middlewares/verifyRole.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, '../../uploads/bienvenida');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `bienvenida-${Date.now()}${ext}`);
    }
});

const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

const router = Router();

router.get('/', getBienvenida);
router.put('/', verifyToken, verifyRole('admin'), upload.single('imagen'), actualizarBienvenida);

export default router;