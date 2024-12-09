export interface Document {
  document_id: number;
  file_id: number;
  originalFilename: string;
  documenttype_id: number | null;
  filename: string;
  filepath: string;
  thumbnail_path: string;
  filesize: number;
  filetype: string;
  documentstatus_id: number;
  partner_id: number;
  sender: string;
  created_at: string;
  updated_at: string;
}

export interface DocumentType {
  documenttype_id: number;
  name: string;
  created_at: string;
  updated_at: string;
  sort_index: number;
  icon_path: string | null;
}

export interface Partner {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  created_at: string;
  updated_at: string;
}

export interface ApiResponse<T> {
  data: T | null;
  error?: string;
}

export * from './auth';