import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUsuario } from '../auth.service';
import { registerUsuario } from '../auth.service';
import { consulta } from '../consulta.service';
import { useSnackbar } from '../../../context/SnackbarContext';
import { Box, Card, Button, Typography, TextField, AppBar, Toolbar, InputAdornment, IconButton, CircularProgress, Stack, useMediaQuery, useTheme, } from '@mui/material';
import { traducirError } from '../../../shared/utils/TraducirError';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import PasswordRoundedIcon from '@mui/icons-material/PasswordRounded';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import TitleRoundedIcon from '@mui/icons-material/TitleRounded';
import SubjectRoundedIcon from '@mui/icons-material/SubjectRounded';
import fondoVacas from '../../../assets/fondoLogin.jpg';
import logo from '../../../assets/CarniSoftLogoSolo.png';

export const Login = () => {
    //Variables que toman los datos del registro y login
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repetirPassword, setRepetirPassword] = useState('');
    //Variables que toman los datos de la consulta - La variable nombre también se usa pára el registro
    const [nombre, setNombre] = useState('');
    const [asunto, setAsunto] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [isLoadingLogin, setIsLoadingLogin] = useState(false);
    const [isLoadingRegister, setIsLoadingRegister] = useState(false);
    const [isLoadingConsulta, setIsLoadingConsulta] = useState(false);
    const [isLogin, setIsLogin] = useState(true);

    const carniSoft = useRef<HTMLDivElement>(null);
    const consultas = useRef<HTMLDivElement>(null);
    const [showPasswordLogin, setShowPasswordLogin] = useState(false);
    const [showPasswordNewPassword, setShowPasswordNewPassword] = useState(false);
    const [showPasswordAgain, setShowPasswordAgain] = useState(false);
    const { showSnackbar } = useSnackbar();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const navigate = useNavigate();

    //Acá es donde se cambia el estado de si es login o register lo que se renderiza en pantalla
    const handleIsRegister = () => {
        setIsLogin(false);
    };
    const handleIsLogin = () => {
        setIsLogin(true);
    };

    //Estas 2 sirven para que cuando apretés el botón del navbar te desplace hacia abajo
    const irAQueEs = () => {
        carniSoft.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    };
    const irAconsultas = () => {
        consultas.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    };

    //Para mostrar o no la contraseña
    const handleShowPasswordLogin = () => {
        setShowPasswordLogin((prev) => !prev);
    };

    const handleShowPasswordNewPassword = () => {
        setShowPasswordNewPassword((prev) => !prev);
    };

    const handleShowPasswordAgain = () => {
        setShowPasswordAgain((prev) => !prev);
    };

    //Manejo del registro
    const handleRegisterUser = async (e: any) => {
        e.preventDefault();
        setIsLoadingRegister(true);

        if (repetirPassword !== password) {
            setIsLoadingRegister(false);
            showSnackbar('Las contraseñas no coinciden', 'error');
            return;
        };

        const resultado = await registerUsuario(nombre, email, password);

        if (!resultado.success) {
            setIsLoadingRegister(false);
            showSnackbar(resultado.message, 'error');
            return;
        };

        setNombre('');
        setEmail('');
        setPassword('');
        setIsLoadingRegister(false);
        setIsLogin(true);

        showSnackbar('Usuario creado correctamente', 'success');
    };

    //Manejo del login
    const handleLogin = async (e: any) => {
        e.preventDefault();
        setIsLoadingLogin(true);

        const resultado = await loginUsuario(email, password);

        if (!resultado.success) {
            setIsLoadingLogin(false);
            showSnackbar(traducirError(resultado.message), 'error');
            return;
        };

        setEmail('');
        setPassword('');
        setIsLoadingLogin(false);

        showSnackbar('Sesión iniciada correctamente', 'success');
        navigate('/panelPrincipal');
    };

    //Manejo de la consulta
    const handleConsulta = async (e: any) => {
        e.preventDefault();
        setIsLoadingConsulta(true);

        const resultado = await consulta(nombre, asunto, descripcion);

        if (!resultado.success) {
            setIsLoadingConsulta(false);
            showSnackbar(resultado.message, 'error');
            return;
        }

        setNombre('');
        setAsunto('');
        setDescripcion('');
        setIsLoadingConsulta(false);

        showSnackbar('Consulta enviada con éxito', 'success');
    };

    const BoxTituloLlenarFormulario = ({ isMobile = false }) => (
        <Stack sx={{
            display: isMobile ? { xs: "flex", md: "none" } : { xs: "none", md: "flex" },
            width: isMobile ? "100%" : "auto",
            m: 0,
            position: 'relative',
            top: '5px'
        }}
        >
            <Typography variant="overline" sx={{ color: "primary.main", letterSpacing: 3, fontWeight: 600, fontSize: '0.80rem' }}>
                Llenar formulario
            </Typography>
        </Stack>
    );

    return (
        <>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: 'column',
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: "100dvh",
                    width: "100%",
                    px: { xs: 2, sm: 4 },
                    py: { xs: 4, sm: 0 },
                }}
            >
                <AppBar
                    elevation={0}
                    sx={{
                        backgroundColor: "#1c1c1c",
                        backdropFilter: 'blur(16px)',
                        boxShadow: 4,
                        p: 0.35
                    }}
                >
                    <Toolbar sx={{
                        display: 'flex',
                        minHeight: { xs: '55px', md: '64px' },
                        flexDirection: 'row',
                        justifyContent: "space-between",
                        alignItems: "center",
                        px: { xs: 0, md: 6 },
                    }}>
                        <Box
                            component="img"
                            alt="Imagen de abuelos"
                            src={logo}
                            sx={{
                                position: 'relative',
                                right: { xs: '35px' },
                                width: "auto",
                                height: { xs: "55px", md: "55px" },
                            }}>
                        </Box>
                        <Box>
                            <Button
                                size='medium'
                                onClick={irAQueEs}
                                sx={{
                                    color: "#ffffff",
                                    textTransform: "none",
                                    px: { xs: 0.8, md: 1.2 },
                                    mr: 1,
                                    borderRadius: 3,
                                    "&:hover": { backgroundColor: "#454546" },
                                }}
                            >
                                ¿Qué es CarniSoft?
                            </Button>
                            <Button
                                size='medium'
                                onClick={irAconsultas}
                                sx={{
                                    color: "#ffffff",
                                    textTransform: "none",
                                    px: { xs: 0.8, md: 1.2 },
                                    mr: { xs: 1, sm: 1, md: 0 },
                                    borderRadius: 3,
                                    "&:hover": { backgroundColor: "#454546" },
                                }}
                            >
                                Contacto
                            </Button>
                        </Box>
                    </Toolbar>
                </AppBar>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: { xs: "column", md: "row" },
                        width: "100%",
                        maxWidth: { xs: 440, md: 900, lg: 1000 },
                        height: 'auto',
                        minHeight: { md: 525, lg: 550 },
                        maxHeight: { md: '85dvh' },
                        borderRadius: 3,
                        overflow: "hidden",
                        boxShadow: "0 8px 40px rgba(0,0,0,0.5)",
                        animation: "slideDown 0.4s ease",
                        "@keyframes slideDown": {
                            from: {
                                opacity: 0,
                                transform: "translateY(-50px)"
                            },
                            to: {
                                opacity: 1,
                                transform: "translateY(0)"
                            }
                        }
                    }}
                >
                    {!isMobile && (
                        <Box
                            sx={{
                                flex: "0 0 45%",
                                bgcolor: "primary.dark",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor: '#1c1c1c'
                            }}
                        >
                            <Box
                                component="img"
                                src={fondoVacas}
                                alt="TERESAI Logo"
                                sx={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                }}
                            />
                        </Box>
                    )}
                    <Card
                        elevation={0}
                        sx={{
                            flex: 1,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            p: { xs: 3, sm: 5 },
                            backgroundColor: "#1c1c1c",
                            borderRadius: 0,
                        }}
                    >
                        {!isLogin ? (
                            <>
                                <Box sx={{ width: "100%", maxWidth: 360, mb: 2.3 }}>
                                    <Typography variant="h5"
                                        sx={{
                                            textAlign: "center",
                                            color: "white",
                                            fontWeight: 700
                                        }}>
                                        Registrate
                                    </Typography>
                                    <Typography variant="body2"
                                        sx={{
                                            textAlign: "center",
                                            mt: 0.5,
                                            color: "rgba(255,255,255,0.5)"
                                        }}>
                                        Completá los datos a continuación para registrarte
                                    </Typography>
                                </Box>
                                <Box
                                    component='form'
                                    onSubmit={handleRegisterUser}
                                    sx={{
                                        width: "100%",
                                        maxWidth: 360,
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: 2,
                                    }}
                                >
                                    <Box
                                        sx={{
                                            height: 56,
                                            borderRadius: 1,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                    >
                                        <TextField
                                            placeholder='Nombre'
                                            type='text'
                                            fullWidth
                                            value={nombre}
                                            onChange={(e) => setNombre(e.target.value)}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: 3,
                                                }
                                            }}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-start", color: "#ffffff" }}>
                                                            <PersonRoundedIcon fontSize='medium' sx={{ mr: 1 }}></PersonRoundedIcon>
                                                        </Box>
                                                    </InputAdornment>
                                                ),
                                            }}
                                        ></TextField>
                                    </Box>
                                    <Box
                                        sx={{
                                            height: 56,
                                            borderRadius: 1,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                    >
                                        <TextField
                                            placeholder='Email'
                                            type='text'
                                            fullWidth
                                            value={email}
                                            onChange={(e: any) => setEmail(e.target.value)}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: 3,
                                                }
                                            }}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-start", color: "#ffffff" }}>
                                                            <EmailRoundedIcon fontSize='medium' sx={{ mr: 1 }}></EmailRoundedIcon>
                                                        </Box>
                                                    </InputAdornment>
                                                ),
                                            }}
                                        ></TextField>
                                    </Box>
                                    <Box
                                        sx={{
                                            height: 56,
                                            borderRadius: 1,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                    >
                                        <TextField
                                            placeholder='Contraseña'
                                            type={showPasswordNewPassword ? "text" : "password"}
                                            fullWidth
                                            value={password}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: 3,
                                                }
                                            }}
                                            onChange={(e: any) => setPassword(e.target.value)}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-start", color: "#ffffff" }}>
                                                            <PasswordRoundedIcon fontSize="medium" sx={{ mr: 1 }}></PasswordRoundedIcon>
                                                        </Box>
                                                    </InputAdornment>
                                                ),
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", color: "#ffffff" }}>
                                                            <IconButton onClick={handleShowPasswordNewPassword}>
                                                                {showPasswordNewPassword ? <VisibilityIcon sx={{ color: "#ffffff" }} /> : <VisibilityOffRoundedIcon sx={{ color: "#ffffff" }} />}
                                                            </IconButton>
                                                        </Box>
                                                    </InputAdornment>
                                                )
                                            }}
                                        ></TextField>
                                    </Box>
                                    <Box
                                        sx={{
                                            height: 56,
                                            borderRadius: 1,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                    >
                                        <TextField
                                            placeholder='Repetir contraseña'
                                            type={showPasswordAgain ? "text" : "password"}
                                            fullWidth
                                            value={repetirPassword}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: 3,
                                                }
                                            }}
                                            onChange={(e: any) => setRepetirPassword(e.target.value)}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-start", color: "#ffffff" }}>
                                                            <PasswordRoundedIcon fontSize="medium" sx={{ mr: 1 }}></PasswordRoundedIcon>
                                                        </Box>
                                                    </InputAdornment>
                                                ),
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", color: "#ffffff" }}>
                                                            <IconButton onClick={handleShowPasswordAgain}>
                                                                {showPasswordAgain ? <VisibilityIcon sx={{ color: "#ffffff" }} /> : <VisibilityOffRoundedIcon sx={{ color: "#ffffff" }} />}
                                                            </IconButton>
                                                        </Box>
                                                    </InputAdornment>
                                                )
                                            }}
                                        ></TextField>
                                    </Box>
                                    <Box
                                        sx={{
                                            height: 48,
                                            borderRadius: 1,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                    >
                                        <Button variant='contained' type='submit' disabled={isLoadingRegister} fullWidth sx={{ textTransform: 'none', fontSize: '1rem', borderRadius: 3 }}>
                                            {isLoadingRegister ? (
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <CircularProgress
                                                        size={20}
                                                        sx={{
                                                            color: "#ffffff",
                                                            marginRight: "10px"
                                                        }}
                                                    />
                                                    <span>Registrandote...</span>
                                                </Box>
                                            ) : 'Registrarse'}
                                        </Button>
                                    </Box>
                                    <Typography
                                        variant="body2"
                                        color="rgba(255,255,255,0.4)"
                                        mt={1}
                                        textAlign="center"
                                    >
                                        ¿Ya tenés una cuenta?{" "}
                                        <Box
                                            component="span"
                                            onClick={handleIsLogin}
                                            sx={{
                                                color: "primary.light",
                                                ml: 0.15,
                                                cursor: "pointer",
                                                "&:hover": { textDecoration: "underline" },
                                            }}
                                        >
                                            Ingresá aquí
                                        </Box>
                                    </Typography>
                                </Box>
                            </>
                        ) : (
                            <>
                                <Box sx={{ width: "100%", maxWidth: 360, mb: 2.3 }}>
                                    <Typography variant="h5"
                                        sx={{
                                            textAlign: "center",
                                            color: "white",
                                            fontWeight: 700
                                        }}>
                                        Iniciar sesión
                                    </Typography>
                                    <Typography variant="body2"
                                        sx={{
                                            textAlign: "center",
                                            mt: 0.5,
                                            color: "rgba(255,255,255,0.5)"
                                        }}>
                                        Ingresá tus datos para continuar
                                    </Typography>
                                </Box>
                                <Box
                                    component="form"
                                    onSubmit={handleLogin}
                                    sx={{
                                        width: "100%",
                                        maxWidth: 360,
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: 2,
                                    }}
                                >
                                    <Box
                                        sx={{
                                            height: 56,
                                            borderRadius: 1,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                    >
                                        <TextField
                                            placeholder='Email'
                                            type='text'
                                            fullWidth
                                            value={email}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: 3,
                                                }
                                            }}
                                            onChange={(e: any) => setEmail(e.target.value)}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-start", color: "#ffffff" }}>
                                                            <EmailRoundedIcon fontSize='medium' sx={{ mr: 1 }}></EmailRoundedIcon>
                                                        </Box>
                                                    </InputAdornment>
                                                ),
                                            }}
                                        ></TextField>
                                    </Box>
                                    <Box
                                        sx={{
                                            height: 56,
                                            borderRadius: 1,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                    >
                                        <TextField
                                            placeholder='Contraseña'
                                            type={showPasswordLogin ? "text" : "password"}
                                            fullWidth
                                            value={password}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: 3,
                                                }
                                            }}
                                            onChange={(e: any) => setPassword(e.target.value)}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-start", color: "#ffffff" }}>
                                                            <PasswordRoundedIcon fontSize="medium" sx={{ mr: 1 }}></PasswordRoundedIcon>
                                                        </Box>
                                                    </InputAdornment>
                                                ),
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", color: "#ffffff" }}>
                                                            <IconButton onClick={handleShowPasswordLogin}>
                                                                {showPasswordLogin ? <VisibilityIcon sx={{ color: "#ffffff" }} /> : <VisibilityOffRoundedIcon sx={{ color: "#ffffff" }} />}
                                                            </IconButton>
                                                        </Box>
                                                    </InputAdornment>
                                                )
                                            }}
                                        ></TextField>
                                    </Box>
                                    <Box
                                        sx={{
                                            height: 48,
                                            borderRadius: 1,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                    >
                                        <Button variant='contained' type='submit' disabled={isLoadingLogin} fullWidth sx={{ textTransform: 'none', fontSize: '1rem', borderRadius: 3 }}>
                                            {isLoadingLogin ? (
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <CircularProgress
                                                        size={20}
                                                        sx={{
                                                            color: "#ffffff",
                                                            marginRight: "10px"
                                                        }}
                                                    />
                                                    <span>Ingresando...</span>
                                                </Box>
                                            ) : 'Ingresar'}
                                        </Button>
                                    </Box>
                                </Box>
                                <Typography
                                    variant="body2"
                                    color="rgba(255,255,255,0.4)"
                                    mt={3}
                                    textAlign="center"
                                >
                                    ¿No tenés una cuenta?{" "}
                                    <Box
                                        component="span"
                                        onClick={handleIsRegister}
                                        sx={{
                                            color: "primary.light",
                                            ml: 0.15,
                                            cursor: "pointer",
                                            "&:hover": { textDecoration: "underline" },
                                        }}
                                    >
                                        Registrate aquí
                                    </Box>
                                </Typography>
                            </>
                        )}
                    </Card>
                </Box>
            </Box>
            <Box
                ref={carniSoft}
                sx={{
                    display: "flex",
                    flexDirection: 'column',
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: "100dvh",
                    width: "100%",
                    px: { xs: 2, sm: 4 },
                    py: { xs: 4, sm: 0 },
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: 'column',
                        justifyContent: { xs: 'center', md: 'flex-start' },
                        width: "100%",
                        p: { xs: 3, md: 5 },
                        maxWidth: { xs: 440, md: 900, lg: 1000 },
                        height: 'auto',
                        minHeight: { xl: 400, md: 525, lg: 550 },
                        maxHeight: { md: '80dvh' },
                        gap: 2,
                        borderRadius: 4,
                        overflow: "hidden",
                        boxShadow: "0 8px 40px rgba(0,0,0,0.5)",
                        backgroundColor: "#1c1c1c",
                    }}
                >
                    <Typography
                        variant="overline"
                        sx={{
                            color: "primary.main",
                            letterSpacing: 3,
                            fontWeight: 600,
                            fontSize: '0.80rem'
                        }}>
                        Plataforma de gestión
                    </Typography>
                    <Typography variant="h3"
                        sx={{
                            color: "white",
                            fontWeight: 700,
                            lineHeight: 1.2,
                        }}>
                        ¿Qué es <Box component="span" sx={{
                            fontWeight: 'bold',
                            backgroundImage: 'linear-gradient(90deg, #ff0101 0%, #ffffff 100%)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            color: 'transparent',
                        }}>CarniSoft?</Box>
                    </Typography>
                    <Typography variant='h6'
                        sx={{
                            color: "#ffffff",
                            lineHeight: 1.8,
                            fontSize: { xs: '1.1rem', md: '1.3rem' }
                        }}>
                        CarniSoft es una aplicación web para carnicerías que permite registrar desposte de animales,
                        calcular automáticamente ganancias y pérdidas, llevar historial de precios y acceder a reportes
                        desde cualquier celular o computadora.
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                        {[
                            { icon: '🥩', texto: 'Registrá desposte de animales fácilmente' },
                            { icon: '📊', texto: 'Calculá ganancias y pérdidas automáticamente' },
                            { icon: '📱', texto: 'Accedé desde cualquier dispositivo' },
                            { icon: '📈', texto: 'Historial de precios y reportes' },
                        ].map((item) => (
                            <Box key={item.texto} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Box sx={{
                                    fontSize: '1.2rem',
                                    bgcolor: 'rgba(124, 124, 124, 0.3)',
                                    borderRadius: '50%',
                                    width: 40,
                                    height: 40,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0
                                }}>
                                    {item.icon}
                                </Box>
                                <Typography sx={{ color: '#ffffff', fontSize: '1rem' }}>
                                    {item.texto}
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                </Box>
            </Box>
            <Box
                ref={consultas}
                sx={{
                    display: "flex",
                    flexDirection: 'column',
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: "50dvh",
                    width: "100%",
                    backgroundColor: "#1c1c1c",
                    borderRadius: 4
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: { xs: 'column', md: 'row' },
                        justifyContent: 'center',
                        width: "100%",
                        flexGrow: 1,
                        gap: 2,
                        overflow: "hidden",
                        boxShadow: "0 8px 40px rgba(0,0,0,0.5)",
                        p: { xs: 3, md: 6 },
                    }}
                >
                    <Box sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        width: { xs: '100%', md: '50%' },
                        gap: 2,
                    }}>
                        <Typography variant="overline" sx={{ color: "primary.main", letterSpacing: 3, fontWeight: 600, fontSize: '0.80rem' }}>
                            Contacto y consultas
                        </Typography>
                        <Typography variant="h4" sx={{ color: "white", fontWeight: 700, lineHeight: 1.3 }}>
                            ¿Querés saber más sobre <Box component="span" sx={{
                                fontWeight: 'bold',
                                backgroundImage: 'linear-gradient(90deg, #ff0101 0%, #ffffff 100%)',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                color: 'transparent',
                            }}>CarniSoft?</Box>
                        </Typography>
                        <Typography variant="body1" sx={{ color: "#ffffff", lineHeight: 1.8, fontSize: { xs: '1.1rem', md: '1.2rem' } }}>
                            Completá el formulario y te respondo a la brevedad. También podés escribirme directamente por WhatsApp o email.
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                            {[
                                { icon: '📧', texto: 'carnisoftware@gmail.com' },
                                { icon: '📱', texto: '+54 9 353-4244165' },
                            ].map((item) => (
                                <Box key={item.texto} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                    <Typography sx={{ fontSize: '1.2rem' }}>{item.icon}</Typography>
                                    <Typography sx={{ color: '#ffffff' }}>{item.texto}</Typography>
                                </Box>
                            ))}
                        </Box>
                    </Box>
                    <BoxTituloLlenarFormulario isMobile={true} />
                    <Box
                        component='form'
                        onSubmit={handleConsulta}
                        sx={{
                            width: { xs: '100%', md: '50%' },
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                            justifyContent: 'center',
                        }}>
                        <BoxTituloLlenarFormulario isMobile={false} />
                        <TextField
                            placeholder='Nombre'
                            type='text'
                            value={nombre}
                            onChange={(e: any) => setNombre(e.target.value)}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 3,
                                }
                            }}
                            fullWidth
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-start", color: "#ffffff" }}>
                                            <PersonRoundedIcon fontSize='medium' sx={{ mr: 1 }}></PersonRoundedIcon>
                                        </Box>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <TextField
                            placeholder='Asunto'
                            type='text'
                            value={asunto}
                            onChange={(e: any) => setAsunto(e.target.value)}
                            fullWidth
                            sx={{
                                input: { color: 'white' },
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 3,
                                }
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-start", color: "#ffffff" }}>
                                            <TitleRoundedIcon fontSize='medium' sx={{ mr: 1 }}></TitleRoundedIcon>
                                        </Box>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <TextField
                            placeholder='Descripción'
                            type='text'
                            value={descripcion}
                            onChange={(e: any) => setDescripcion(e.target.value)}
                            fullWidth
                            multiline
                            rows={4}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1.5, mr: 1 }}>
                                        <SubjectRoundedIcon sx={{ color: "#ffffff" }} ></SubjectRoundedIcon>
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: 3,
                                    alignItems: 'flex-start',
                                    paddingTop: 0,
                                    paddingLeft: 1.9,
                                },
                                "& .MuiInputBase-input": {
                                    color: "#ffffff",
                                    WebkitTextFillColor: "#ffffff",
                                    paddingTop: '14px',
                                    ml: 1
                                },
                            }}
                        />
                        <Button variant='contained' type='submit' fullWidth disabled={isLoadingConsulta} sx={{ py: 1, borderRadius: 3, mb: { xs: 2 }, textTransform: 'none', fontSize: '1rem' }}>
                            {isLoadingConsulta ? (
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <CircularProgress
                                        size={20}
                                        sx={{
                                            color: "#ffffff",
                                            marginRight: "10px"
                                        }}
                                    />
                                    <span>Enviando...</span>
                                </Box>
                            ) : 'Enviar consulta'}
                        </Button>
                    </Box>
                </Box>
            </Box>
        </>
    );
};

