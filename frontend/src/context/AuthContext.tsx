import { createContext } from 'react';
import type { AuthContextType } from './AuthTypes';

const AuthContext = createContext<AuthContextType | null>(null);

export default AuthContext;