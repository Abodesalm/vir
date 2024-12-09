export interface LoginCredentials {
  email: string;
  password: string;
}

export interface User {
  id: number;
  partner_id: number;
  name: string;
  email: string;
  is_active: boolean;
  role: string;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  status: string;
  access_token: string;
  token_type: string;
  expires_in: number;
  user: User;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}