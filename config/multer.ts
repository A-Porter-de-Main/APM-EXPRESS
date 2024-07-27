import multer, { FileFilterCallback } from 'multer'
import { v4 as uuidv4 } from 'uuid';
import { Express, Request } from "express";
import path from "path"

const uploadsDir = "uploads";

export const fileStorage = multer.diskStorage({
  

  destination: (
    req: Express.Request,
    file: Express.Multer.File,
    callback: (error: Error | null, destination: string) => void
  ): void => {
    callback(null, uploadsDir);
    // callback(null, path);
  },

  filename: (
    req: Request,
    file: Express.Multer.File,
    callback: (error: Error | null, filename: string) => void
  ): void => {
    const uuid = uuidv4();
    const ext = path.extname(file.originalname);
    const newFileName = uuid + ext;
    callback(null, newFileName);
  },

})

export const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  callback: FileFilterCallback
): void => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    callback(null, true)
  } else {
    callback(null, false)
  }

}

const upload = multer({
  storage: fileStorage,
  fileFilter: fileFilter,
  limits: { fileSize: 5000000 } // 5 MB
});

export default upload;