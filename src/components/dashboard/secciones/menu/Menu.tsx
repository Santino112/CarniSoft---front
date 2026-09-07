import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../auth/context/UseAuth';
import { supabase } from '../../../../config/supabaseClient';
import { Typography } from '@mui/material';
import { useSnackbar } from '../../../../context/SnackbarContext';
import MenuItem from '@mui/material/MenuItem';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import ArrowDropDownRoundedIcon from '@mui/icons-material/ArrowDropDownRounded';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';

function MenuUsuario() {
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const { showSnackbar } = useSnackbar();
    const { user } = useAuth();

    const email = user?.email || 'Correo';
    const usuario = (user?.user_metadata?.nombre as string) || 'Usuario';

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setAnchorEl(null);
        showSnackbar('Sesión cerrada correctamente.', 'success');
        navigate("/");
    };

    return (
        <Box>
            <Button
                id='basic-button'
                fullWidth
                onClick={(e: React.MouseEvent<HTMLButtonElement>) => setAnchorEl(e.currentTarget)}
                sx={{ color: "#ffffff", justifyContent: "flex-start", p: 2, textTransform: "none" }}
            >
                <Avatar sx={{ mr: 2 }} />
                {usuario}
                <ArrowDropDownRoundedIcon fontSize="large" sx={{
                    ml: "auto",
                    transform: Boolean(anchorEl) ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s ease-in-out'
                }} />
            </Button>
            <Menu
                anchorEl={anchorEl}
                disablePortal
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
                anchorOrigin={{ vertical: "top", horizontal: "left" }}
                transformOrigin={{ vertical: "bottom", horizontal: "left" }}
                slotProps={{
                    paper: {
                        sx: {
                            color: "#ffffff",
                            width: anchorEl ? anchorEl.clientWidth : "auto",
                            backgroundColor: "#141414",
                            mb: 2,
                            borderRadius: 3,
                            boxShadow: 4,
                            '& .MuiList-root': { py: 0, px: 0 },
                            '& .MuiDivider-root': { my: 0, borderColor: '#333333' },
                            '& .MuiMenuItem-root': {
                                marginBottom: 0,
                                width: "100%",
                                boxSizing: "border-box",
                                '&:hover': { backgroundColor: '#333333' },
                                '&.Mui-selected': { backgroundColor: '#444444' },
                                '&.Mui-selected:hover': { backgroundColor: '#555555' },
                            },
                        }
                    }
                }}
            >
                <MenuItem disabled sx={{ borderRadius: 3 }}>
                    <Typography variant='body2' sx={{ position: "relative"}}>{email || "Correo"}</Typography>
                </MenuItem>
                <Divider sx={{ my: 0, borderColor: '#333333' }} />
                <MenuItem onClick={handleLogout} disabled sx={{ borderRadius: 0, color: "#ffffff", '&:hover': { backgroundColor: "#454546", } }}>
                    <PersonRoundedIcon fontSize="medium" sx={{ mr: 1 }} />Perfil
                </MenuItem>
                <MenuItem onClick={handleLogout} sx={{ borderRadius: 0, color: "#ffffff", "&:hover": { backgroundColor: "#454546", color: "#ff6b6b" } }}>
                    <LogoutRoundedIcon fontSize="medium" sx={{ mr: 1 }} />Cerrar sesión
                </MenuItem>
            </Menu>
        </Box >
    );
}

export default MenuUsuario;
