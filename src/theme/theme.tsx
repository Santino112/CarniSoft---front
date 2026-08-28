import { createTheme } from "@mui/material";

export const Theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#C62828',
            dark: '#8E0000',
            light: '#FF5F52',
        },
        secondary: {
            main: '#4E342E',
        },
        background: {
            default: '#232323',
            paper: '#FFFFFF',
        },
        success: {
            main: '#2E7D32',
        },
    }
});