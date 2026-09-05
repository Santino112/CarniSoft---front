import { useEffect, useState, type ReactNode } from 'react';
import { Box } from '@mui/material';
import { supabase } from '../../../config/supabaseClient.js';
import { AuthContext, type AuthContextType } from './authContextDefinition.js';
import logoSinTexto from '../../../assets/CarniSoftLogoSolo.png';

export interface AuthProviderProps {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (!active) return;
        setSession(data.session);
      } catch (error) {
        console.error("Error al obtener la sesión inicial:", error);
        if (!active) return;
        setSession(null);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadSession();

    // cambios de auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!active) return;
        if (_event === "SIGNED_IN") setLoading(true);
        setSession(session);
        setLoading(false);
      }
    );

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const value: AuthContextType = {
    session,
    user: session?.user ?? null,
    accessToken: session?.access_token ?? null,
    loading,
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "var(--app-height)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box component="img" src={logoSinTexto} alt="CarniSoft" sx={{ width: 800, height: "auto" }} />
      </Box>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

