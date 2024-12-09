import { Document, ApiResponse } from '../types';
import { getStoredAuth } from './auth';

const API_BASE_URL = 'https://api.virgo-sy.com/api';

export async function fetchNextDocument(): Promise<ApiResponse<Document>> {
  try {
    const { token } = getStoredAuth();
    if (!token) {
      throw new Error('No authentication token available');
    }

    const response = await fetch(`${API_BASE_URL}/document/next`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to load next document');
    }

    const data = await response.json();
    return { data: data.data };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Failed to load document'
    };
  }
}

export async function updateDocument(documentId: number, status: 'processed' | 'rejected'): Promise<ApiResponse<void>> {
  try {
    const { token } = getStoredAuth();
    if (!token) {
      throw new Error('No authentication token available');
    }

    const response = await fetch(`${API_BASE_URL}/document/update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        document_id: documentId,
        status
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to update document');
    }

    return { data: undefined };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Failed to update document'
    };
  }
}