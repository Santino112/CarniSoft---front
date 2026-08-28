import { useState } from 'react';
import { useTheme } from '@emotion/react';
import Desposte from "../desposte/Desposte";
import MenuUsuario from '../menu/Menu';
import Inicio from "../inicio/Inicio";
import NuevaRes from "../nuevasCarnes/NuevaRes";
import Seguimiento from '../seguimiento/Seguimiento';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

const drawerWidth = 280;

function ResponsiveDrawer() {
    const [paginaActiva, setPaginaActiva] = useState("");
    const [mobileOpen, setMobileOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);

    const handleDrawerClose = () => {
        setIsClosing(true);
        setMobileOpen(false);
    };

    const handleDrawerTransitionEnd = () => {
        setIsClosing(false);
    };

    const handleDrawerToggle = () => {
        if (!isClosing) {
            setMobileOpen(!mobileOpen);
        }
    };

    const drawer = (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            height: 'var(--app-height)',
            border: 'none'
        }}>
            <Toolbar sx={{
                display: "flex",
                justifyContent: "flex-start",
                flexShrink: 0,
                backgroundColor: "rgb(20, 20, 20)",
                border: 'none'
            }}>
                <Typography variant="h5" noWrap component="div" sx={{
                    position: "relative",
                    right: { xs: -5, sm: 3, md: 5, lg: 5, xl: 4 },
                    mr: "auto",
                    color: "#ffffff"
                }}>
                    CarniSoft
                </Typography>
            </Toolbar>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    overflowY: "auto",
                    maxHeight: "320px",
                    width: "100%",
                    minHeight: "250px",
                    p: 1,
                    backgroundColor: "rgb(20, 20, 20)",
                }}
            >
                <Button variant='contained' fullWidth onClick={() => setPaginaActiva("inicio")} sx={{
                    justifyContent: "flex-start",
                    backgroundColor: paginaActiva === 'inicio' ? '#ffffff' : 'transparent',
                    boxShadow: paginaActiva === 'inicio' ? '0 0 10px #ffffff' : 'none',
                    color: paginaActiva === 'inicio' ? '#000000' : '#ffffff',
                    borderRadius: 3,
                    textTransform: 'none',
                    fontSize: '1rem',
                    mb: 2,
                    mt: 2,
                    "&:hover": {
                        backgroundColor: "#ffffff",
                        boxShadow: `0 0 10px #ffffff`,
                        color: '#000000'
                    }
                }}>Inicio</Button>
                <Button variant='contained' fullWidth onClick={() => setPaginaActiva("desposte")} sx={{
                    justifyContent: "flex-start",
                    backgroundColor: paginaActiva === 'desposte' ? '#ffffff' : 'transparent',
                    boxShadow: paginaActiva === 'desposte' ? '0 0 10px #ffffff' : 'none',
                    color: paginaActiva === 'desposte' ? '#000000' : '#ffffff',
                    borderRadius: 3,
                    textTransform: 'none',
                    fontSize: '1rem',
                    mb: 2,
                    "&:hover": {
                        backgroundColor: "#ffffff",
                        boxShadow: `0 0 10px #ffffff`,
                        color: '#000000'
                    }
                }}>Desposte de la res</Button>
                <Button variant='contained' fullWidth onClick={() => setPaginaActiva("seguimiento")} sx={{
                    justifyContent: "flex-start",
                    backgroundColor: paginaActiva === 'seguimiento' ? '#ffffff' : 'transparent',
                    boxShadow: paginaActiva === 'seguimiento' ? '0 0 10px #ffffff' : 'none',
                    color: paginaActiva === 'seguimiento' ? '#000000' : '#ffffff',
                    borderRadius: 3,
                    textTransform: 'none',
                    fontSize: '1rem',
                    mb: 2,
                    "&:hover": {
                        backgroundColor: "#ffffff",
                        boxShadow: `0 0 10px #ffffff`,
                        color: '#000000'
                    }
                }}>Seguimiento y control</Button>
                <Button variant='contained' disabled fullWidth sx={{
                    justifyContent: "flex-start",
                    backgroundColor: 'transparent',
                    color: '#ffffff',
                    borderRadius: 3,
                    textTransform: 'none',
                    fontSize: '1rem',
                    mb: 1,
                    "&:hover": {
                        backgroundColor: "#ffffff",
                        boxShadow: `0 0 10px #ffffff`,
                        color: '#000000'
                    }
                }}>Chat con IA</Button>
            </Box>
            <Box sx={{
                flexGrow: 1,
                backgroundColor: "rgb(20, 20, 20)",
                border: 'none'
            }}>
            </Box>
            <Box sx={{ mt: 'auto', border: 'none' }}>
                <MenuUsuario />
            </Box>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar
                position="fixed"
                sx={{
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                    color: "#ffffff",
                }}
            >
                <Toolbar
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        backgroundColor: "rgb(20, 20, 20)",
                    }}
                >
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: "none" } }}
                    >
                        <MenuIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
                aria-label="mailbox folders"
            >
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onTransitionEnd={handleDrawerTransitionEnd}
                    onClose={handleDrawerClose}
                    sx={{
                        display: { xs: "block", sm: "none" },
                        "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth }
                    }}
                    slotProps={{
                        root: {
                            keepMounted: true
                        }
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: drawerWidth,
                            borderRight: 'none',
                            bgcolor: "#111111",
                            backdropFilter: 'blur(10px)',
                        },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>
            <Box
                component="main"
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100dvh",
                    width: {
                        xs: "100%",
                        sm: "100%",
                        md: "1600px"
                    },
                    minWidth: 0,
                    flexGrow: 1,
                    overflowY: "hidden",
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#4a4a4a transparent',
                    '&::-webkit-scrollbar': {
                        width: '6px',
                    },
                    '&::-webkit-scrollbar-track': {
                        background: 'transparent',
                    },
                    '&::-webkit-scrollbar-thumb': {
                        backgroundColor: '#2f2f2f',
                        borderRadius: '8px',
                    },
                    '&::-webkit-scrollbar-thumb:hover': {
                        backgroundColor: '#444',
                    },
                }}
            >
                <Toolbar />
                <Box
                    sx={{
                        flexGrow: 1,
                        height: "100%",
                        minHeight: 0,
                        display: "flex",
                        overflowY: "hidden",
                    }}
                >
                    {paginaActiva === "desposte" ? <Desposte />
                        : paginaActiva === "nuevaRes" ? <NuevaRes />
                            : paginaActiva === "seguimiento" ? <Seguimiento />
                                : <Inicio />
                    }
                </Box>
            </Box>
        </Box>
    );
}

export default ResponsiveDrawer;
