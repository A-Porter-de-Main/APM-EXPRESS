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
    console.log("le filename originlaaaaaa: ", file.originalname)
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
    console.log("new file name: ", newFileName)
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
  limits: { fileSize: 1024 * 1024 * 5 } // 5 MB
});

export default upload;