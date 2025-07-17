export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface AuthContextData {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
}
