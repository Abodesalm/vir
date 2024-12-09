import { getStoredAuth, refreshToken, isTokenExpired } from './auth';

const API_BASE_URL = 'https://api.virgo-sy.com/api';

export interface DocumentType {
  documenttype_id: number;
  name: string;
  created_at: string;
  updated_at: string;
  sort_index: number;
  icon_path: string | null;
}

export async function fetchDocumentTypes(): Promise<DocumentType[]> {
  try {
    const { token } = getStoredAuth();
    if (!token) {
      throw new Error('No authentication token available');
    }

    // Check if token needs refresh before making the request
    if (isTokenExpired()) {
      const refreshed = await refreshToken();
      if (!refreshed) {
        throw new Error('Session expired. Please login again.');
      }
    }

    const { token: currentToken } = getStoredAuth();
    const response = await fetch(`${API_BASE_URL}/document-types`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${currentToken}`,
      },
      credentials: 'include',
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Session expired. Please login again.');
      }
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch document types');
    }
    
    const result = await response.json();
    
    if (!result.data || !Array.isArray(result.data)) {
      throw new Error('Invalid response format');
    }

    return result.data
      .filter((type: DocumentType) => type.sort_index > 0)
      .sort((a: DocumentType, b: DocumentType) => a.sort_index - b.sort_index);
  } catch (error) {
    console.error('Error fetching document types:', error);
    return [];
  }
}