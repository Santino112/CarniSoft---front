import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../../../api/httpClient';
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
    const [anchorEl, setAnchorEl] = useState(null);

    const handleLogout = async () => {
        await api.post('/api/auth/logOut');
        navigate("/");
    };

    return (
        <Box sx={{backgroundColor: '#141414'}}>
            <Button
                id='basic-button'
                fullWidth
                onClick={(e: any) => setAnchorEl(e.currentTarget)}
                sx={{ color: "#ffffff", justifyContent: "flex-start", p: 2, textTransform: "none" }}
            >
                <Avatar sx={{ mr: 1 }} />
                Santino
                <ArrowDropDownRoundedIcon fontSize="large" sx={{
                    ml: "auto",
                    transform: Boolean(anchorEl) ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s ease-in-out'
                }} />
            </Button>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
                anchorOrigin={{ vertical: "top", horizontal: "left" }}
                transformOrigin={{ vertical: "bottom", horizontal: "right" }}
                MenuListProps={{
                    sx: {
                        p: 0,
                        fontSize: "21px",
                        color: "#ffffff",
                        borderRadius: 3,
                        backgroundColor: 'background.default'
                    }
                }}
                PaperProps={{
                    sx: {
                        backgroundColor: "#000000",
                        color: "#ffffff",
                        minWidth: { xs: "60%", sm: "30%", md: "22%", lg: "17%", xl: "13%" },
                        py: 0,
                        borderRadius: 3,
                        '& .MuiList-root': {
                            py: 0,
                            px: 0,
                        },
                        '& .MuiDivider-root': {
                            my: 0,
                            borderColor: '#333333',
                        },
                        '& .MuiMenuItem-root': {
                            marginBottom: 0,
                            width: "100%",
                            boxSizing: "border-box",
                            '&:hover': { backgroundColor: '#333333' },
                            '&.Mui-selected': { backgroundColor: '#444444' },
                            '&.Mui-selected:hover': { backgroundColor: '#555555' },
                        },
                    }
                }}
            >
                <MenuItem onClick={handleLogout} disabled sx={{ borderRadius: 0, color: "#ffffff", '&:hover': { backgroundColor: "#454546", } }}>
                    <PersonRoundedIcon fontSize="medium" sx={{ mr: 1 }} />Perfil
                </MenuItem>
                <Divider sx={{ my: 0, borderColor: '#333333' }} />
                <MenuItem onClick={handleLogout} sx={{ borderRadius: 0, color: "#ffffff", "&:hover": { backgroundColor: "#454546", color: "#ff6b6b" } }}>
                    <LogoutRoundedIcon fontSize="medium" sx={{ mr: 1 }} />Cerrar sesión
                </MenuItem>
            </Menu>
        </Box >
    );
}

export default MenuUsuario;
