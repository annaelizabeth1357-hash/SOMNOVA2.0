export interface User {
  id: number;
  email: string;
}

export interface Dream {
  id: number;
  user_id: number;
  content: string;
  completed_text: string;
  created_at: string;
}

export interface DreamInputData {
  text?: string;
  audio?: string; // base64
  images?: string[]; // base64 array
}
