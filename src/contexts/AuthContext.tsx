
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'superadmin' | 'admin' | 'agent';
  company?: string;
  domain?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MOCK_USER: User = {
  id: '1',
  name: 'João Silva',
  email: 'joao@empresa.com',
  role: 'admin',
  company: 'Empresa Demo',
  domain: 'empresa.dohoo.com.br'
};

const PERMISSIONS = {
  superadmin: ['*'],
  admin: [
    'dashboard.view',
    'extensions.manage',
    'ringgroups.manage',
    'inbound.manage',
    'outbound.manage',
    'trunks.manage',
    'ura.manage',
    'plans.view',
    'reports.view',
    'settings.manage'
  ],
  agent: [
    'dashboard.view',
    'extensions.view',
    'reports.view'
  ]
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(MOCK_USER);
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  const login = async (email: string, password: string) => {
    // Simulação de login
    if (email && password) {
      setUser(MOCK_USER);
      setIsAuthenticated(true);
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    
    const userPermissions = PERMISSIONS[user.role] || [];
    return userPermissions.includes('*') || userPermissions.includes(permission);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      login,
      logout,
      hasPermission
    }}>
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

export default AuthContext;
