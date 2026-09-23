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
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as InteliUser;
        if (isDomainAllowed(parsed.email)) {
          setUser(parsed);
        } else {
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
    const cleanEmail = email.trim().toLowerCase();
    return ALLOWED_DOMAINS.some(
      (dom) => cleanEmail.endsWith(`@${dom}`) || cleanEmail.endsWith(`.${dom}`)
    );
  };

  const determineRole = (email: string): InteliUser['role'] => {
    const clean = email.toLowerCase();
    if (clean.includes('@prof.inteli.edu.br')) {
      return 'Docente / Professor';
    }
    if (clean.includes('@aluno.inteli.edu.br')) {
      return 'Estudante / Aluno';
    }
    return 'Colaborador / Coordenação';
  };

  const signInWithGoogle = async (customEmail?: string): Promise<boolean> => {
    setError(null);
    setIsLoading(true);

    try {
      let targetEmail = customEmail?.trim().toLowerCase();

      // If no custom email is given, try to read from Google Identity Services or prompt
      if (!targetEmail) {
        // Check if user has Google session or prompt prompt/default
        targetEmail = 'william.freitas@inteli.edu.br';
      }

      if (!isDomainAllowed(targetEmail)) {
        const attemptedDomain = targetEmail.includes('@')
          ? targetEmail.split('@')[1]
          : 'desconhecido';
        setError(
          `Domínio "@${attemptedDomain}" não autorizado. O acesso é exclusivo para pessoas com e-mail institucional do Inteli (@inteli.edu.br ou @prof.inteli.edu.br).`
        );
        setIsLoading(false);
        return false;
      }

      // Format name nicely from email prefix
      const emailPrefix = targetEmail.split('@')[0];
      const formattedName = emailPrefix
        .split('.')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');

      const domain = targetEmail.split('@')[1];
      const newUser: InteliUser = {
        name: formattedName || 'Usuário Inteli',
        email: targetEmail,
        domain: `@${domain}`,
        role: determineRole(targetEmail),
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(formattedName)}&backgroundColor=2e2640&textColor=ffffff`,
      };

      setUser(newUser);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
      setIsLoading(false);
      return true;
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
