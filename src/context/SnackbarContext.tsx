import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { AlertColor } from '@mui/material';
import { Snackbar, Alert } from '@mui/material';

// 1. Tipo para las propiedades del Provider
interface SnackbarProviderProps {
  children: ReactNode;
}

// 2. Tipo para las funciones que expondrá el Contexto
interface SnackbarContextType {
  showSnackbar: (message: string, severity?: AlertColor) => void;
}

// 3. Crear el contexto inicializando con undefined para validar su uso correcto
const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

export const SnackbarProvider: React.FC<SnackbarProviderProps> = ({ children }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [severity, setSeverity] = useState<AlertColor>('info');

  const showSnackbar = (msg: string, sev: AlertColor = 'info') => {
    setMessage(msg);
    setSeverity(sev);
    setOpen(true);
  };

  const handleClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return;
    setOpen(false);
  };

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}

      <Snackbar
        open={open}
        autoHideDuration={4000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleClose}
          severity={severity}
          variant="filled"
          sx={{
            width: '100%',
            borderRadius: 4,
            fontWeight: 500,
            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.5)',
          }}
        >
          {message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
};

// 4. Custom Hook con protección de TypeScript
export const useSnackbar = (): SnackbarContextType => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error('useSnackbar debe ser usado dentro de un SnackbarProvider');
  }
  return context;
};