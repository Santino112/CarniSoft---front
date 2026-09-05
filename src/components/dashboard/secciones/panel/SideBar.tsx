import { useState } from 'react';
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
import Divider from '@mui/material/Divider';
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import { useTheme, useMediaQuery } from '@mui/material';
//Iconos sideBar
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import ContentCutRoundedIcon from '@mui/icons-material/ContentCutRounded';
import TrackChangesRoundedIcon from '@mui/icons-material/TrackChangesRounded';
import ForumRoundedIcon from '@mui/icons-material/ForumRounded';
import AssessmentRoundedIcon from '@mui/icons-material/AssessmentRounded';

function ResponsiveDrawer() {
    const [paginaActiva, setPaginaActiva] = useState("");
    const [mobileOpen, setMobileOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const theme = useTheme();
    const isNotebook = useMediaQuery(theme.breakpoints.between('md', 'lg'));
    const drawerWidth = isNotebook ? 220 : 260;

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
                backgroundColor: "#1c1c1c",
                border: 'none'
            }}>
                <Typography variant="h5" noWrap component="div" sx={{
                    position: "relative",
                    right: { xs: -5, sm: 3, md: 5, lg: 5, xl: 4 },
                    mr: "auto",
                    fontWeight: 'bold',
                    backgroundImage: 'linear-gradient(90deg, #ff0101 0%, #ffffff 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent',
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
                    backgroundColor: "#1c1c1c",
                }}
            >
                <Button variant='contained' startIcon={<HomeRoundedIcon fontSize='medium' />} fullWidth onClick={() => setPaginaActiva("inicio")} sx={{
                    display: {xs: 'none', sm: 'flex'},
                    justifyContent: "flex-start",
                    backgroundColor: paginaActiva === 'inicio' ? '#454546' : 'transparent',
                    boxShadow: 2,
                    color: '#ffffff',
                    borderRadius: 3,
                    textTransform: 'none',
                    fontSize: '1rem',
                    mb: 2,
                    "&:hover": {
                        backgroundColor: "#454546",
                    }
                }}>Inicio</Button>
                <Button variant='contained' startIcon={<ContentCutRoundedIcon fontSize='small' />} fullWidth onClick={() => setPaginaActiva("desposte")} sx={{
                    display: {xs: 'none', sm: 'flex'},
                    justifyContent: "flex-start",
                    backgroundColor: paginaActiva === 'desposte' ? '#454546' : 'transparent',
                    boxShadow: 2,
                    color: '#ffffff',
                    borderRadius: 3,
                    textTransform: 'none',
                    fontSize: '1rem',
                    mb: 2,
                    "&:hover": {
                        backgroundColor: "#454546",
                    }
                }}>Desposte de la res</Button>
                <Button variant='contained' startIcon={<TrackChangesRoundedIcon fontSize='small' />} fullWidth onClick={() => setPaginaActiva("seguimiento")} sx={{
                    display: {xs: 'none', sm: 'flex'},
                    justifyContent: "flex-start",
                    backgroundColor: paginaActiva === 'seguimiento' ? '#454546' : 'transparent',
                    boxShadow: 2,
                    color: '#ffffff',
                    borderRadius: 3,
                    textTransform: 'none',
                    fontSize: '1rem',
                    mb: 2,
                    "&:hover": {
                        backgroundColor: "#454546",
                    }
                }}>Seguimiento y control</Button>
                <Button variant='contained' startIcon={<ForumRoundedIcon fontSize='small' />} disabled fullWidth sx={{
                    justifyContent: "flex-start",
                    backgroundColor: 'transparent',
                    color: '#ffffff',
                    mt: {xs: 1, sm: 0},
                    borderRadius: 3,
                    textTransform: 'none',
                    fontSize: '1rem',
                    mb: 2,
                    "&:hover": {
                        backgroundColor: "#ffffff",
                        boxShadow: `0 0 10px #ffffff`,
                        color: '#000000'
                    }
                }}>Chat con IA</Button>
                <Button variant='contained' startIcon={<AssessmentRoundedIcon fontSize='small' />} disabled fullWidth sx={{
                    justifyContent: "flex-start",
                    backgroundColor: 'transparent',
                    color: '#ffffff',
                    borderRadius: 3,
                    textTransform: 'none',
                    fontSize: '1rem',
                    "&:hover": {
                        backgroundColor: "#ffffff",
                        boxShadow: `0 0 10px #ffffff`,
                        color: '#000000'
                    }
                }}>Estadisticas</Button>
            </Box>
            <Box sx={{
                flexGrow: 1,
                backgroundColor: "#1c1c1c",
                border: 'none'
            }}>
            </Box>
            <Divider sx={{ color: '#1c1c1c' }} />
            <Box sx={{ mt: 'auto', border: 'none', backgroundColor: '#1c1c1c' }}>
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
                    display: { xs: 'none', sm: 'block' },
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                    color: "#ffffff",
                }}
            >
                <Toolbar
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        backgroundColor: "#1c1c1c",
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
                    minHeight: "100dvh",
                    width: {
                        xs: "100%",
                        sm: "100%",
                        md: "1600px"
                    },
                    minWidth: 0,
                    flexGrow: 1,
                    pb: {xs: 6, md: 0},
                    mb: 0,
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
                <Toolbar sx={{display: { xs: "none", sm: "block" }}}/>
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
            {/* Barra inferior fija solo para móviles (xs) */}
            <Paper
                sx={{
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    zIndex: 1200,
                    display: { xs: 'block', sm: 'none' },
                }}
                elevation={3}
            >
                <BottomNavigation
                    showLabels
                    value={paginaActiva}
                    onChange={(_event, newValue) => {
                        setPaginaActiva(newValue);
                    }}
                    sx={{
                        bgcolor: '#1c1c1c',
                        '& .Mui-selected': {
                            color: 'primary.main',
                        }
                    }}
                >
                    <BottomNavigationAction
                        label="Inicio"
                        value="inicio"
                        icon={<HomeRoundedIcon />}
                    />
                    <BottomNavigationAction
                        label="Desposte"
                        value="desposte"
                        icon={<ContentCutRoundedIcon />}
                    />
                    <BottomNavigationAction
                        label="Seguimiento"
                        value="seguimiento"
                        icon={<TrackChangesRoundedIcon />}
                    />
                    <BottomNavigationAction
                        label="Menú"
                        onClick={handleDrawerToggle}
                        icon={<MenuIcon />}
                    />
                </BottomNavigation>
            </Paper>
        </Box>
    );
}

export default ResponsiveDrawer;
