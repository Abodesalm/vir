import { API_BASE_URL } from "../config";

export function getStorageUrl(filepath: string): string {
  if (filepath.startsWith("http")) {
    return filepath;
  }

  // Clean the filepath to ensure correct format
  const cleanPath = filepath
    .replace(/^project\//, "") // Remove leading project/
    .replace(/^storage\//, "") // Remove leading storage/
    .replace(/^documents\//, ""); // Remove leading documents/

  // Construct the storage URL
  return `${API_BASE_URL}/storage/documents/${cleanPath}`;
}
