import { v2 as cloudinary } from 'cloudinary';
import { env } from '../config/env';

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

export const uploadImage = async (file: Express.Multer.File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'iot-copilot',
        resource_type: 'image',
      },
      (error, result) => {
        if (error) reject(error);
        else if (result) resolve(result.secure_url);
        else reject(new Error('Upload failed: no result returned'));
      }
    );
    uploadStream.end(file.buffer);
  });
};

export const deleteImage = async (url: string): Promise<void> => {
  const publicId = url.split('/').pop()?.split('.')[0];
  if (publicId) {
    await cloudinary.uploader.destroy(`iot-copilot/${publicId}`);
  }
};
