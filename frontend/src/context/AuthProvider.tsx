import React, { useState } from 'react';
import AuthContext from './AuthContext';
import type { User } from './AuthTypes';

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(() => {
        const saved = localStorage.getItem('arban_user');
        return saved ? JSON.parse(saved) : null;
    });

  const login = (u: User) => {
    setUser(u);
    localStorage.setItem('arban_user', JSON.stringify(u));
  };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('arban_user');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
        {children}
        </AuthContext.Provider>
    );
    };

export default AuthProvider;