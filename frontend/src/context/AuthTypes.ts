export type Role = 'viewer' | 'creator';

export interface User {
    name: string;
    email: string;
    role: Role;
}

export interface AuthContextType {
    user: User | null;
    login: (user: User) => void;
    logout: () => void;
}