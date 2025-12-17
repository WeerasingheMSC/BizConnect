// Cloudinary configuration and upload utility

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export interface CloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
  url: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
}

/**
 * Upload an image to Cloudinary
 * @param file - The image file to upload
 * @returns Promise with the upload response containing the image URL
 */
export const uploadToCloudinary = async (file: File): Promise<CloudinaryUploadResponse> => {
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
    throw new Error('Cloudinary configuration is missing. Please check your .env file.');
  }

  // Validate file type
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (!validTypes.includes(file.type)) {
    throw new Error('Invalid file type. Please upload a valid image (JPEG, PNG, GIF, or WebP).');
  }

  // Validate file size (max 5MB)
  const maxSize = 5 * 1024 * 1024; // 5MB in bytes
  if (file.size > maxSize) {
    throw new Error('File size exceeds 5MB. Please upload a smaller image.');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  formData.append('folder', 'bizconnect/logos');

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to upload image');
    }

    const data: CloudinaryUploadResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
};

/**
 * Get optimized image URL from Cloudinary
 * @param publicId - The public ID of the image
 * @param transformations - Optional transformations (width, height, quality, etc.)
 * @returns Optimized image URL
 */
export const getOptimizedImageUrl = (
  publicId: string,
  transformations?: {
    width?: number;
    height?: number;
    quality?: string;
    crop?: string;
  }
): string => {
  if (!CLOUDINARY_CLOUD_NAME) {
    return publicId;
  }

  const { width = 400, height = 400, quality = 'auto', crop = 'fill' } = transformations || {};
  
  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/w_${width},h_${height},c_${crop},q_${quality}/${publicId}`;
};

/**
 * Test Cloudinary connection
 * @returns Configuration status and connection info
 */
export const testCloudinaryConnection = () => {
  const config = {
    cloudName: CLOUDINARY_CLOUD_NAME,
    uploadPreset: CLOUDINARY_UPLOAD_PRESET,
    isConfigured: !!(CLOUDINARY_CLOUD_NAME && CLOUDINARY_UPLOAD_PRESET),
    uploadUrl: CLOUDINARY_CLOUD_NAME 
      ? `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`
      : 'Not configured'
  };
  
  console.log('🔍 Cloudinary Configuration:');
  console.log('  Cloud Name:', config.cloudName || '❌ Missing');
  console.log('  Upload Preset:', config.uploadPreset || '❌ Missing');
  console.log('  Upload URL:', config.uploadUrl);
  console.log('  Status:', config.isConfigured ? '✅ Ready' : '❌ Not configured');
  
  return config;
};
