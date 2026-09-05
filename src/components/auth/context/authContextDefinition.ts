import { createContext } from 'react';

export interface AuthContextType {
    session: any,
    user: any,
    accessToken: string | null,
    loading: boolean
};

export const AuthContext = createContext<AuthContextType | null>(null);
