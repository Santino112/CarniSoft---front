import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from "@mui/material/styles";
import { Theme } from './theme/theme';
import { SnackbarProvider } from './context/SnackbarContext';
import { AuthProvider, type AuthProviderProps } from './components/auth/context/AuthContext';
import { useAuth } from './components/auth/context/UseAuth';
import { Box, CssBaseline } from '@mui/material';
import logoSinTexto from '../src/assets/CarniSoftLogoSolo.png';
import './App.css';

const Login = lazy(() =>
  import('./components/auth/components/auth').then((module) => ({
    default: module.Login,
  }))
);
const PanelPrincipal = lazy(() =>
  import('./components/dashboard/components/PanelPrincipal').then((module) => ({
    default: module.PanelPrincipal,
  }))
);

const RouteLoader = () => (
  <Box
    sx={{
      minHeight: "var(--app-height)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      bgcolor: "#141414"
    }}
  >
    <Box
      component="img"
      src={logoSinTexto}
      alt="TeresAI"
      sx={{ width: 800, height: "auto", bgcolor: "#141414" }}
    />
  </Box>
);

const PrivateRoute = ({ children }: AuthProviderProps) => {
  const { user, loading } = useAuth();

  if (loading) return <RouteLoader />;
  return user ? children : <Navigate to='/' />;
};

const PublicRoute = ({ children }: AuthProviderProps) => {
  const { user, loading } = useAuth();

  if (loading) return <RouteLoader />;
  return !user ? children : <Navigate to="/panelPrincipal" />;
};


function App() {
  return (
    <AuthProvider>
      <ThemeProvider theme={Theme}>
        <CssBaseline />
        <SnackbarProvider>
          <Router>
            <Suspense fallback={<RouteLoader />}>
              <Routes>
                <Route path='/' element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                }></Route>
                <Route path='/panelPrincipal' element={
                  <PrivateRoute>
                    <PanelPrincipal />
                  </PrivateRoute>
                }></Route>
              </Routes>
            </Suspense>
          </Router>
        </SnackbarProvider>
      </ThemeProvider>
    </AuthProvider>
  )
};

export default App;
