export function formatDate(date) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(date).toLocaleDateString('en-US', options)
}

export function truncate(str, length) {
  if (!str || str.length <= length) return str
  return str.slice(0, length) + '...'
}

/**
 * Uploads an image to ImgBB service
 * @param {File} file The image file to upload
 * @param {string} apiKey Your ImgBB API key
 * @returns {Promise<string>} A promise that resolves to the image URL
 */
export async function uploadToImgBB(file, apiKey) {
  if (!file) return null;
  
  const formData = new FormData();
  formData.append('image', file);
  
  try {
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: 'POST',
      body: formData
    });
    
    const data = await response.json();
    
    if (data.success) {
      return data.data.url;
    } else {
      console.error('Error uploading image:', data.error);
      return null;
    }
  } catch (error) {
    console.error('Error uploading to ImgBB:', error);
    return null;
  }
}