'use client';

import { createContext, useContext, useState, useCallback } from 'react';

import type { ReactNode } from 'react';

export interface UserData {
  id: string;
  email: string;
  name: string;
  imageUrl?: string;
  firstName?: string;
  lastName?: string;
  organizationId?: string;
}

interface UserContextValue {
  user: UserData | null;
  setUser: (user: UserData | null) => void;
  updateUser: (updates: Partial<UserData>) => void;
  refreshUser: () => void;
}

const UserContext = createContext<UserContextValue | null>(null);

interface UserProviderProps {
  children: ReactNode;
  initialUser: UserData | null;
}

export function UserProvider({
  children,
  initialUser,
}: UserProviderProps): React.ReactElement {
  const [user, setUser] = useState<UserData | null>(initialUser);

  const updateUser = useCallback((updates: Partial<UserData>): void => {
    setUser((prev) => (prev ? { ...prev, ...updates } : null));
  }, []);

  const refreshUser = useCallback((): void => {
    window.dispatchEvent(new CustomEvent('user-updated'));
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, updateUser, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser(): UserContextValue {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
}
