import React, { createContext, useContext, useState, useEffect } from 'react';

export interface InteliUser {
  name: string;
  email: string;
  avatar?: string;
  domain: string;
  role: 'Docente / Professor' | 'Colaborador / Coordenação' | 'Estudante / Aluno';
}

interface AuthContextType {
  user: InteliUser | null;
  isLoading: boolean;
  error: string | null;
  signInWithGoogle: (customEmail?: string) => Promise<boolean>;
  signOut: () => void;
  clearError: () => void;
}

const ALLOWED_DOMAINS = ['inteli.edu.br', 'prof.inteli.edu.br', 'aluno.inteli.edu.br'];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'inteli_auth_user_v1';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<InteliUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Restore saved session on mount
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY) || localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as InteliUser;
        if (isDomainAllowed(parsed.email)) {
          setUser(parsed);
        } else {
          sessionStorage.removeItem(STORAGE_KEY);
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    } catch (e) {
      console.error('Erro ao restaurar sessão de login:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const isDomainAllowed = (email: string): boolean => {
    if (!email || !email.includes('@')) return false;
    const cleanEmail = email.trim().toLowerCase();
    const domain = cleanEmail.split('@')[1];
    return ALLOWED_DOMAINS.includes(domain);
  };

  const determineRole = (email: string): InteliUser['role'] => {
    const clean = email.toLowerCase();
    if (clean.endsWith('@prof.inteli.edu.br')) {
      return 'Docente / Professor';
    }
    if (clean.endsWith('@aluno.inteli.edu.br')) {
      return 'Estudante / Aluno';
    }
    return 'Colaborador / Coordenação';
  };

  const processAuthenticatedUser = (userData: { email: string; name?: string; avatar?: string }): boolean => {
    const targetEmail = userData.email.trim().toLowerCase();

    if (!isDomainAllowed(targetEmail)) {
      const domain = targetEmail.includes('@') ? targetEmail.split('@')[1] : 'desconhecido';
      setError(
        `Acesso negado para "@${domain}". Somente contas institucionais do Inteli (@inteli.edu.br ou @prof.inteli.edu.br) possuem autorização de acesso.`
      );
      setUser(null);
      sessionStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(STORAGE_KEY);
      return false;
    }

    const emailPrefix = targetEmail.split('@')[0];
    const formattedName = userData.name || emailPrefix
      .split('.')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');

    const domain = targetEmail.split('@')[1];
    const newUser: InteliUser = {
      name: formattedName || 'Usuário Inteli',
      email: targetEmail,
      domain: `@${domain}`,
      role: determineRole(targetEmail),
      avatar: userData.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(formattedName)}&backgroundColor=2e2640&textColor=ffffff`,
    };

    setUser(newUser);
    setError(null);
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    return true;
  };

  const signInWithGoogle = async (providedEmail?: string): Promise<boolean> => {
    setError(null);
    setIsLoading(true);

    try {
      if (!providedEmail || !providedEmail.trim()) {
        setError('Por favor, informe seu e-mail institucional do Inteli.');
        setIsLoading(false);
        return false;
      }

      const success = processAuthenticatedUser({ email: providedEmail.trim() });
      setIsLoading(false);
      return success;
    } catch (err: any) {
      console.error('Erro na autenticação:', err);
      setError(err.message || 'Falha ao autenticar com a conta Google Inteli.');
      setIsLoading(false);
      return false;
    }
  };

  const signOut = () => {
    setUser(null);
    setError(null);
    sessionStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_KEY);
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        signInWithGoogle,
        signOut,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser utilizado dentro de um AuthProvider');
  }
  return context;
};
