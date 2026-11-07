import * as FileSystem from 'expo-file-system/legacy';

import {
  CLOUDINARY_UPLOAD_URL,
  CLOUDINARY_UPLOAD_PRESET,
} from '../config/cloudinary';
export async function uploadImageToCloudinary(imageUri, folder) {
  if (!imageUri || typeof imageUri !== 'string') {
    throw new Error('No se recibió una ruta válida para la fotografía.');
  }

  if (!folder || typeof folder !== 'string') {
    throw new Error('No se recibió una carpeta válida para el conductor.');
  }
  try {
    const extension = imageUri
      .split('?')[0]
      .split('.')
      .pop()
      .toLowerCase();

    const mimeType =
      extension === 'png' ? 'image/png' :
      extension === 'webp' ? 'image/webp' :
      extension === 'heic' ? 'image/heic' :
      extension === 'heif' ? 'image/heif' :
      'image/jpeg';

    const base64 = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    if (!base64) {
      throw new Error('La fotografía está vacía.');
    }

    const formData = new FormData();

    formData.append(
      'file',
      `data:${mimeType};base64,${base64}`,
    );

    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append(
      'asset_folder',
      `uberclone-drivers/${folder}`,
    );
    const response = await fetch(CLOUDINARY_UPLOAD_URL, {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('Error de Cloudinary:', result);

      throw new Error(
        result.error?.message || `Cloudinary: ${response.status}`,
      );
    }

    if (!result.secure_url) {
      throw new Error(
        'Cloudinary no devolvió la URL de la fotografía.',
      );
    }

    console.log('Fotografía subida:', {
      assetFolder: result.asset_folder,
      publicId: result.public_id,
    });

    return result.secure_url;

  } catch (error) {
    console.error(`Error subiendo imagen (${folder}):`, error);
    throw error;
  }
}
