import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from "@mui/material/styles";
import { Theme } from './theme/theme';
import { SnackbarProvider } from './context/SnackbarContext';
import { Login } from './components/auth/components/auth';
import { PanelPrinciapal } from './components/dashboard/components/PanelPrincipal';
import { CssBaseline } from '@mui/material';
import './App.css'

function App() {

  return (
    <>
      <ThemeProvider theme={Theme}>
        <CssBaseline />
        <SnackbarProvider>
          <Router>
            <Routes>
              <Route path='/' element={<Login />}></Route>
              <Route path='/panelPrincipal' element={<PanelPrinciapal />}></Route>
            </Routes>
          </Router>
        </SnackbarProvider>
      </ThemeProvider>
    </>
  )
}

export default App;
