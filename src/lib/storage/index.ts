import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs/promises';
import path from 'path';

export interface StorageUploadResult {
  url: string;
  publicId: string;
}

export interface IStorageService {
  uploadImage(
    buffer: Buffer,
    filename: string,
    mimeType?: string
  ): Promise<StorageUploadResult>;
  deleteImage(publicId: string): Promise<boolean>;
}

// 1. Cloudinary Implementation
class CloudinaryStorageService implements IStorageService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    });
  }

  async uploadImage(
    buffer: Buffer,
    filename: string,
    mimeType = 'image/jpeg'
  ): Promise<StorageUploadResult> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'stellify_products',
          resource_type: 'image',
          public_id: path.parse(filename).name,
        },
        (error, result) => {
          if (error || !result) {
            return reject(error || new Error('Cloudinary upload returned null'));
          }
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
          });
        }
      );
      uploadStream.end(buffer);
    });
  }

  async deleteImage(publicId: string): Promise<boolean> {
    try {
      const res = await cloudinary.uploader.destroy(publicId);
      return res.result === 'ok';
    } catch {
      return false;
    }
  }
}

// 2. Local File System Implementation (Fallback / Dev)
class LocalStorageService implements IStorageService {
  private uploadsDir = path.join(process.cwd(), 'public', 'uploads');

  private async ensureDir() {
    try {
      await fs.access(this.uploadsDir);
    } catch {
      await fs.mkdir(this.uploadsDir, { recursive: true });
    }
  }

  async uploadImage(
    buffer: Buffer,
    filename: string
  ): Promise<StorageUploadResult> {
    await this.ensureDir();
    const sanitizedFilename = `${Date.now()}-${filename.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const filePath = path.join(this.uploadsDir, sanitizedFilename);
    await fs.writeFile(filePath, buffer);

    return {
      url: `/uploads/${sanitizedFilename}`,
      publicId: sanitizedFilename,
    };
  }

  async deleteImage(publicId: string): Promise<boolean> {
    try {
      const filePath = path.join(this.uploadsDir, publicId);
      await fs.unlink(filePath);
      return true;
    } catch {
      return false;
    }
  }
}

// Factory export based on configuration
const isCloudinaryConfigured = Boolean(
  process.env.STORAGE_PROVIDER === 'cloudinary' &&
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
);

export const storageService: IStorageService = isCloudinaryConfigured
  ? new CloudinaryStorageService()
  : new LocalStorageService();

export default storageService;
