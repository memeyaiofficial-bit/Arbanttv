import { useContext } from 'react';
import AuthContext from './AuthContext';
import type { AuthContextType } from './AuthTypes';

const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};

export default useAuth;