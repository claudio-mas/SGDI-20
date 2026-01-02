import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import Keycloak from 'keycloak-js';
import { api } from '../services/api';

interface User {
  id: number;
  nome: string;
  email: string;
  perfil: string;
  setor?: string;
  permissoes: string[];
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
  hasPermission: (permissao: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const keycloak = new Keycloak({
  url: import.meta.env.VITE_KEYCLOAK_URL,
  realm: import.meta.env.VITE_KEYCLOAK_REALM,
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    keycloak
      .init({ onLoad: 'check-sso', checkLoginIframe: false })
      .then(async (authenticated) => {
        if (authenticated && keycloak.token) {
          api.defaults.headers.common['Authorization'] = `Bearer ${keycloak.token}`;
          
          // Sincronizar com backend
          const response = await api.post('/auth/callback', {
            keycloakId: keycloak.subject,
            email: keycloak.tokenParsed?.email,
            nome: keycloak.tokenParsed?.name,
          });
          
          localStorage.setItem('token', response.data.token);
          api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
          
          // Buscar dados completos do usuário
          const meResponse = await api.get('/auth/me');
          setUser(meResponse.data);
        }
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));

    // Refresh token
    setInterval(() => {
      keycloak.updateToken(70).catch(() => keycloak.login());
    }, 60000);
  }, []);

  const login = () => keycloak.login();
  const logout = () => {
    localStorage.removeItem('token');
    keycloak.logout();
  };
  const hasPermission = (permissao: string) => user?.permissoes.includes(permissao) ?? false;

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
