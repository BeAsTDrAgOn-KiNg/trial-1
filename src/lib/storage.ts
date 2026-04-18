/**
 * Simulates uploading a file by returning a local object URL.
 * @param file The file to upload
 * @param bucket The name of the storage bucket (unused in simulation)
 * @param path The path within the bucket (unused in simulation)
 */
export const uploadFile = async (file: File, bucket: string, path: string): Promise<string | null> => {
  try {
    // Simulating a network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // In a real local-only app, we use createObjectURL. 
    // Note: These URLs are revoked when the page is closed/refreshed.
    return URL.createObjectURL(file);
  } catch (error) {
    console.error('Unexpected error during sim-upload:', error);
    return null;
  }
};

/**
 * Converts a base64 string to a File object.
 */
export const base64ToFile = (base64: string, filename: string): File => {
  const arr = base64.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
};
