/**
 * Firebase Storage utilities for image upload and management
 */

import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  listAll,
  type UploadResult,
} from 'firebase/storage';
import { storage } from './config';

/**
 * Upload image to Firebase Storage
 */
export async function uploadImage(
  file: File,
  path: string,
  onProgress?: (progress: number) => void
): Promise<string> {
  try {
    // Create a storage reference
    const storageRef = ref(storage, path);

    // Upload the file
    const snapshot: UploadResult = await uploadBytes(storageRef, file);

    // Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref);

    return downloadURL;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new Error('Failed to upload image');
  }
}

/**
 * Delete image from Firebase Storage
 */
export async function deleteImage(path: string): Promise<void> {
  try {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
  } catch (error) {
    console.error('Error deleting image:', error);
    throw new Error('Failed to delete image');
  }
}

/**
 * Get all images in a folder
 */
export async function listImages(folderPath: string): Promise<string[]> {
  try {
    const storageRef = ref(storage, folderPath);
    const result = await listAll(storageRef);

    const urls = await Promise.all(
      result.items.map((itemRef) => getDownloadURL(itemRef))
    );

    return urls;
  } catch (error) {
    console.error('Error listing images:', error);
    throw new Error('Failed to list images');
  }
}

/**
 * Generate unique filename for upload
 */
export function generateFileName(originalName: string): string {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);
  const extension = originalName.split('.').pop();
  return `${timestamp}-${randomString}.${extension}`;
}

/**
 * Validate image file
 */
export function validateImageFile(file: File): {
  valid: boolean;
  error?: string;
} {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.',
    };
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'File size exceeds 5MB limit.',
    };
  }

  return { valid: true };
}

/**
 * Compress image before upload (optional)
 */
export async function compressImage(file: File, maxWidth: number = 1920): Promise<File> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;

      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              reject(new Error('Failed to compress image'));
            }
          },
          file.type,
          0.9
        );
      };

      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
  });
}
