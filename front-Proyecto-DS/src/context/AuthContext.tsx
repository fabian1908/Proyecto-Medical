import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import axios from 'axios';

interface User {
  id: number;
  dniPersona: string;
  tipoUsuarioId: number; // 1: Paciente, 2: Doctor, 3: Admin
  usuario: string;
  // Agrega más campos si son necesarios
}

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isDoctor: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Intentar cargar el usuario desde localStorage al iniciar
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (userData: User) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.tipoUsuarioId === 3;
  const isDoctor = user?.tipoUsuarioId === 2;

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, isAdmin, isDoctor }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};