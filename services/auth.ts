import { LoginCredentials, AuthResponse, ApiResponse } from '../types';

const API_BASE_URL = 'https://api.virgo-sy.com/api';

export async function login(credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Origin': window.location.origin,
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    if (data.access_token) {
      const expiresAt = Date.now() + (data.expires_in * 1000);
      localStorage.setItem('auth_token', data.access_token);
      localStorage.setItem('auth_expires_at', expiresAt.toString());
      localStorage.setItem('user', JSON.stringify(data.user));
      return { data };
    }

    throw new Error('No access token received');
  } catch (error) {
    console.error('Login error:', error);
    return { 
      data: null, 
      error: error instanceof Error ? error.message : 'Login failed' 
    };
  }
}

export async function refreshToken(): Promise<boolean> {
  try {
    const { token } = getStoredAuth();
    if (!token) return false;

    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Origin': window.location.origin,
      },
    });

    if (!response.ok) {
      throw new Error('Token refresh failed');
    }

    const data = await response.json();

    if (!data.access_token) {
      throw new Error('No access token received from refresh');
    }

    const expiresAt = Date.now() + (data.expires_in * 1000);
    localStorage.setItem('auth_token', data.access_token);
    localStorage.setItem('auth_expires_at', expiresAt.toString());

    return true;
  } catch (error) {
    console.error('Token refresh failed:', error);
    logout();
    return false;
  }
}

export function getStoredAuth() {
  const token = localStorage.getItem('auth_token');
  const user = localStorage.getItem('user');
  const expiresAt = localStorage.getItem('auth_expires_at');
  
  return {
    token,
    user: user ? JSON.parse(user) : null,
    expiresAt: expiresAt ? parseInt(expiresAt, 10) : null,
  };
}

export function isTokenExpired(): boolean {
  const { expiresAt } = getStoredAuth();
  if (!expiresAt) return true;
  
  // Consider token expired 5 minutes before actual expiration
  return Date.now() > (expiresAt - 5 * 60 * 1000);
}

export function logout() {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('auth_expires_at');
  localStorage.removeItem('user');
}