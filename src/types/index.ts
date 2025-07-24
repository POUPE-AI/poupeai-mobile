export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthContextData {
  user: User | null;
  isLoading: boolean;
  signIn: () => Promise<boolean>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
  isNavigationReady: boolean;
}

export interface TokenData {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  expiresAt: string;
}

export interface KeycloakUserInfo {
  sub: string;
  name?: string;
  preferred_username?: string;
  email: string;
}

export * from './categories';
export * from './accounts';
export * from './budgets';
export * from './cards';
