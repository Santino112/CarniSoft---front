import { useContext } from 'react';
import { AuthContext } from './authContextDefinition';

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === null) {
    throw new Error('useAuth debe usarse dentro de un <AuthProvider>');
  }

  return context;
};