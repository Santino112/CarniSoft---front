import { Box, Stack, Typography, Paper } from "@mui/material";
import { useAuth } from "../../../auth/context/UseAuth";
import Logo from "../../../../assets/CarniSoftLogo.png"

const Inicio = () => {
    const { user } = useAuth();

    const usuario = (user?.user_metadata?.nombre as string) || 'Usuario';

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "100%",
                height: "100%",
                overflow: "hidden",
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    flexGrow: 1,
                    maxWidth: "900px",
                    width: "100%",
                    p: { xs: 2, sm: 3, md: 4 },
                    animation: "slideDown 0.4s ease",
                    "@keyframes slideDown": {
                        from: {
                            opacity: 0,
                            transform: "translateY(-40px)"
                        },
                        to: {
                            opacity: 1,
                            transform: "translateY(0)"
                        }
                    }
                }}
            >
                <Paper
                    elevation={0}
                    sx={{
                        width: '100%',
                        p: { xs: 3, sm: 4, md: 5 },
                        borderRadius: 4,
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        backgroundColor: '#141414',
                        backgroundImage: 'radial-gradient(ellipse at top right, #ef44441f, transparent 100%)',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
                    }}
                >
                    <Stack
                        direction={{ xs: 'column', md: 'row' }}
                        spacing={{ xs: 0, md: 4 }}
                        alignItems="center"
                        justifyContent="space-between"
                    >
                        <Box
                            sx={{
                                textAlign: { xs: 'center', md: 'left' },
                                flex: 1,
                            }}
                        >
                            <Typography
                                variant="h3"
                                component="h1"
                                sx={{
                                    fontWeight: 800,
                                    fontSize: { xs: '1.8rem', sm: '2.4rem', md: '2.8rem' },
                                    color: '#ffffff',
                                    letterSpacing: '-0.02em',
                                    lineHeight: 1.2,
                                    mb: 2,
                                }}
                            >
                                Bienvenido de vuelta,{' '}
                                <Box
                                    component="span"
                                    sx={{
                                        background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        display: 'inline-block',
                                    }}
                                >
                                    {usuario}
                                </Box>
                            </Typography>
                            <Typography variant="body1" sx={{fontWeight: 800, color: '#ffffff', fontSize: '1.05rem' }}>
                                Panel de gestión activado y listo para operar.
                            </Typography>
                        </Box>

                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                position: 'relative',
                            }}
                        >
                            <Box
                                sx={{
                                    position: 'absolute',
                                    width: { xs: '120px', md: '180px' },
                                    height: { xs: '120px', md: '170px' },
                                    backgroundColor: 'rgba(239, 68, 68, 0.15)',
                                    filter: 'blur(35px)',
                                    borderRadius: '50%',
                                }}
                            />

                            <Box
                                component="img"
                                src={Logo}
                                alt="CarniSoft Logo"
                                sx={{
                                    height: { xs: '200px', sm: '200px', md: '300px' },
                                    width: 'auto',
                                    objectFit: 'contain',
                                    zIndex: 1,
                                    filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.4))',
                                    transition: 'transform 0.3s ease-in-out',
                                    '&:hover': {
                                        transform: 'scale(1.04)',
                                    },
                                }}
                            />
                        </Box>
                    </Stack>
                </Paper>
            </Box>
        </Box>
    )
};

export default Inicio;