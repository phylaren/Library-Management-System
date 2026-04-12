import multer from 'multer';
import { Request, Response, NextFunction } from 'express';

const storage = multer.memoryStorage();

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
  
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true); 
  } else {
    cb(new Error('# Неправильний тип файлу. Тільки розширення JPEG, PNG та WEBP дозволені'));
  }
};

export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});

export const uploadAvatar = (req: Request, res: Response, next: NextFunction) => {
  const singleUpload = upload.single('avatar');

  singleUpload(req, res, (err: any) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ error: `# Помилка завантаження: ${err.message}` });
    } else if (err) {
      return res.status(400).json({ error: `# Невірний формат: ${err.message}` });
    }
    
    next();
  });
};