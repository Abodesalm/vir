import { Document, DocumentType, ApiResponse, Partner } from "../types";
import { getStoredAuth } from "./auth";

const API_BASE_URL = "https://api.virgo-sy.com/api";

export async function fetchPartnerInfo(
  partnerId: number
): Promise<ApiResponse<Partner>> {
  try {
    const { token } = getStoredAuth();
    if (!token) {
      throw new Error("No authentication token available");
    }

    const response = await fetch(`${API_BASE_URL}/partners/${partnerId}`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch partner information");
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    return {
      data: null,
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch partner information",
    };
  }
}

export async function createSplitDocument(
  originalDocumentId: number,
  imageData: string,
  documentTypeId: string
): Promise<ApiResponse<Document>> {
  try {
    const { token } = getStoredAuth();
    if (!token) {
      throw new Error("No authentication token available");
    }

    const response = await fetch(`${API_BASE_URL}/document/split`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        document_id: originalDocumentId,
        image_data: imageData.split(",")[1],
        documenttype_id: documentTypeId,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to create split document");
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    return {
      data: null,
      error:
        error instanceof Error
          ? error.message
          : "Failed to create split document",
    };
  }
}

export async function rotateDocument(
  documentId: number
): Promise<ApiResponse<Document>> {
  try {
    const { token } = getStoredAuth();
    if (!token) {
      throw new Error("No authentication token available");
    }

    const response = await fetch(`${API_BASE_URL}/document/rotate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        document_id: documentId,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to rotate document");
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    return {
      data: null,
      error:
        error instanceof Error ? error.message : "Failed to rotate document",
    };
  }
}

export async function resizeDocument(
  documentId: number,
  scale: number
): Promise<ApiResponse<Document>> {
  try {
    const { token } = getStoredAuth();
    if (!token) {
      throw new Error("No authentication token available");
    }

    const response = await fetch(`${API_BASE_URL}/document/resize`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        document_id: documentId,
        scale: scale,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to resize document");
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    return {
      data: null,
      error:
        error instanceof Error ? error.message : "Failed to resize document",
    };
  }
}

export async function getDocumentCount(): Promise<
  ApiResponse<{ count: number }>
> {
  try {
    const { token } = getStoredAuth();
    if (!token) {
      throw new Error("No authentication token available");
    }

    const response = await fetch(`${API_BASE_URL}/document/count`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch document count");
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    return {
      data: null,
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch document count",
    };
  }
}
