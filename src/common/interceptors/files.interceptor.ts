import { FileFieldsInterceptor } from "@nestjs/platform-express";
import { Request } from "express";
import { createWriteStream, existsSync, mkdirSync } from "fs";
import { diskStorage } from "multer";
// @ts-ignore
import { FileUpload } from "graphql-upload";
import * as path from "path";

export const normalizeFilename = (str: string): string => {
  const originalName = str.replace(/\s/g, "_");
  const extension = originalName.split(".").pop();
  const timestamp = Date.now();

  if (!extension) {
    throw new Error("Failed to determine file extension");
  }

  return `${timestamp}_${originalName}`;
};

const allowedMimeTypes = [
  'image/jpeg',
  'image/png',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/zip',
  'application/x-rar-compressed',
  'application/octet-stream',
];

const allowedExtensions = [
  '.jpg',
  '.jpeg',
  '.png',
  '.pdf',
  '.doc',
  '.docx',
  '.xls',
  '.xlsx',
  '.zip',
  '.rar',
  '.mp4',
  '.mpeg',
];

/* For Multiple Types of File Interception */
export const CustomFileInterceptor = (directory: string, fieldName: string) =>
  FileFieldsInterceptor([{ name: fieldName, maxCount: 25 }], {
    storage: diskStorage({
      destination(_req: Request, _file: Express.Multer.File, callback) {
        if (!existsSync(`./public`)) mkdirSync(`./public`);
        if (!existsSync(`./public/uploads`)) mkdirSync(`./public/uploads`);
        if (!existsSync(`./public/uploads/${directory}`))
          mkdirSync(`./public/uploads/${directory}`);

        callback(null, `./public/uploads/${directory}`);
      },
      filename(_req, file, callback) {
        const filename = normalizeFilename(file.originalname);
        callback(null, filename);
      },
    }),
    fileFilter(_req, file, callback) {
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "application/pdf",
        "video/mp4",
        "video/mpeg",
      ];
      if (!allowedTypes.includes(file.mimetype)) {
        throw new Error(`Invalid file type: ${file.mimetype}`);
      }
      callback(null, true);
    },
  });

  export async function handleGraphQLFileUpload(
    file: FileUpload,
    directory: string
  ): Promise<{ filePath: string; filename: string }> {
    const { filename, mimetype, createReadStream } = file;
  
    // Check mime type
    if (!allowedMimeTypes.includes(mimetype)) {
      throw new Error(`Invalid file type: ${mimetype}`);
    }
  
    // Check file extension
    const ext = path.extname(filename).toLowerCase();
    if (!allowedExtensions.includes(ext)) {
      throw new Error(`Unsupported file extension: ${ext}`);
    }
  
    // Prepare directory
    const basePath = path.join(process.cwd(), 'public/uploads');
    const dirPath = path.join(basePath, directory);
    if (!existsSync(basePath)) mkdirSync(basePath);
    if (!existsSync(dirPath)) mkdirSync(dirPath);
  
    const cleanFilename = normalizeFilename(filename);
    const fullPath = path.join(dirPath, cleanFilename);
  
    // Save file
    const stream = createReadStream();
    const writeStream = createWriteStream(fullPath);
    await new Promise<void>((resolve, reject) => {
      stream.pipe(writeStream).on('finish', resolve).on('error', reject);
    });
  
    return {
      filePath: `/uploads/${directory}/${cleanFilename}`,
      filename: cleanFilename,
    };
  }
