export interface User {
  id: string;
  name: string;
  email: string;
  gender: string;
  birthDate: string;
  avatarUrl?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  gender: string;
  birthDate: string;
  avatarUrl?: string;
}
