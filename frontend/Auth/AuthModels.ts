// Mirrors backend com.example.InvestmentGoalManagementPlatform.DTO classes

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  role: 'ADMIN' | 'USER';
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  email: string;
  role: string;
}

