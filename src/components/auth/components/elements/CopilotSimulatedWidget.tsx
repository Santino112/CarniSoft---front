import { useState, useRef, useEffect } from 'react';
import { 
  Box, Fab, Paper, IconButton, Typography, Zoom, 
  TextField, Avatar, InputAdornment, Chip, Stack 
} from '@mui/material';
import SmartToyRoundedIcon from '@mui/icons-material/SmartToyRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import PersonIcon from '@mui/icons-material/Person';

interface Message {
  id: number;
  text: string;
  sender: 'bot' | 'user';
  time: string;
}

// Las 4 opciones iniciales
const QUICK_OPTIONS = [
  '¿Cómo funciona el desposte?',
  '¿Cómo registro una res?',
  '¿Cómo inicio sesión?',
  'Otra consulta'
];

export const CopilotSimulatedWidget = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: 'Hola, soy la asistente de CarniSoft y te estaré acompañando en tus consultas sobre la aplicación. ¿En que puedo ayudarte?',
      sender: 'bot',
      time: 'Justo ahora'
    }
  ]);
  const [showQuickOptions, setShowQuickOptions] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open, isTyping, showQuickOptions]);

  // Función encargada de procesar cualquier mensaje enviado (manual o via clic en Chip)
  const sendMessage = (textToSend: string) => {
    if (!textToSend.trim()) return;

    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newUserMsg: Message = {
      id: Date.now(),
      text: textToSend,
      sender: 'user',
      time: now
    };

    setMessages((prev) => [...prev, newUserMsg]);
    setInput('');
    setShowQuickOptions(false); // Ocultar los botones de sugerencia tras la primera interacción
    setIsTyping(true);

    // Lógica de respuesta simulada según la opción elegida
    setTimeout(() => {
      let botResponse = 'Esta es una respuesta generada desde la lógica de Copilot Studio.';
      
      const lower = textToSend.toLowerCase();
      if (lower.includes('desposte')) {
        botResponse = 'El módulo de desposte permite registrar el ingreso de medias reses, clasificar los cortes primarios y secundarios, y calcular automáticamente el rendimiento y las mermas. ¿Necesitas ayuda con otra cosa?';
      } else if (lower.includes('registro una res') || lower.includes('res')) {
        botResponse = 'Para registrar una res, ve al menú "Desposte" > "Nueva Entrada", ingresa el número de tropa, peso de balanza y fecha de faena. ¿Necesitas ayuda con otra cosa?';
      } else if (lower.includes('inicio sesión') || lower.includes('sesión')) {
        botResponse = 'Para iniciar sesión, ingresa tu correo registrado y contraseña en la pantalla principal. Si olvidaste tu clave, puedes reestablecerla con el soporte administrativo. ¿Necesitas ayuda con otra cosa?';
      } else if (lower.includes('otra consulta')) {
        botResponse = 'Entendido. Por favor escribe con detalle tu duda o inconveniente para poder guiarte.';
      }

      const newBotMsg: Message = {
        id: Date.now() + 1,
        text: botResponse,
        sender: 'bot',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, newBotMsg]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: { xs: 70, sm: 24 },
        right: 24,
        zIndex: 1300,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
      }}
    >
      <Zoom in={open} unmountOnExit>
        <Paper
          elevation={12}
          sx={{
            mb: 2,
            width: { xs: 'calc(100vw - 32px)', sm: 380 },
            height: { xs: '65vh', sm: 540 },
            borderRadius: 3,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            bgcolor: '#18181b',
            border: '1px solid #27272a',
          }}
        >
          {/* Header */}
          <Box
            sx={{
              p: 1.5,
              px: 2,
              bgcolor: '#09090b',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid #27272a',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Avatar sx={{ bgcolor: '#ef4444', width: 32, height: 32 }}>
                <SmartToyRoundedIcon sx={{ fontSize: '1.2rem' }} />
              </Avatar>
              <Box>
                <Typography variant="subtitle2" fontWeight={600} sx={{ lineHeight: 1.2 }}>
                  Copilot CarniSoft
                </Typography>
                <Typography variant="caption" sx={{ color: '#22c55e', fontSize: '0.7rem' }}>
                  ● En línea (Demostración)
                </Typography>
              </Box>
            </Box>
            <IconButton size="small" onClick={() => setOpen(false)} sx={{ color: '#a1a1aa' }}>
              <CloseRoundedIcon fontSize="small" />
            </IconButton>
          </Box>

          {/* Área de Mensajes */}
          <Box
            sx={{
              flexGrow: 1,
              p: 2,
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: 1.5,
              bgcolor: '#121214',
            }}
          >
            {messages.map((msg) => (
              <Box
                key={msg.id}
                sx={{
                  display: 'flex',
                  justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  gap: 1,
                }}
              >
                {msg.sender === 'bot' && (
                  <Avatar sx={{ bgcolor: '#ef4444', width: 24, height: 24, mt: 0.5 }}>
                    <SmartToyRoundedIcon sx={{ fontSize: '0.9rem' }} />
                  </Avatar>
                )}
                
                <Box sx={{ maxWidth: '75%' }}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 1.2,
                      px: 1.8,
                      borderRadius: 2,
                      bgcolor: msg.sender === 'user' ? '#ef4444' : '#27272a',
                      color: '#ffffff',
                      borderTopRightRadius: msg.sender === 'user' ? 2 : 12,
                      borderTopLeftRadius: msg.sender === 'bot' ? 2 : 12,
                    }}
                  >
                    <Typography variant="body2" sx={{ fontSize: '0.875rem', lineHeight: 1.4 }}>
                      {msg.text}
                    </Typography>
                  </Paper>
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: '0.65rem',
                      color: '#71717a',
                      display: 'block',
                      mt: 0.3,
                      textAlign: msg.sender === 'user' ? 'right' : 'left',
                    }}
                  >
                    {msg.time}
                  </Typography>
                </Box>

                {msg.sender === 'user' && (
                  <Avatar sx={{ bgcolor: '#3f3f46', width: 24, height: 24, mt: 0.5 }}>
                    <PersonIcon sx={{ fontSize: '0.9rem' }} />
                  </Avatar>
                )}
              </Box>
            ))}

            {/* Opciones rápidas (Sugerencias iniciales) */}
            {showQuickOptions && (
              <Stack spacing={1} sx={{ mt: 1, ml: 4, maxWidth: '85%' }}>
                {QUICK_OPTIONS.map((option, index) => (
                  <Chip
                    key={index}
                    label={option}
                    onClick={() => sendMessage(option)}
                    clickable
                    sx={{
                      justifyContent: 'flex-start',
                      bgcolor: '#1c1c21',
                      color: '#ef4444',
                      border: '1px solid #ef4444',
                      fontWeight: 500,
                      '&:hover': {
                        bgcolor: '#ef4444',
                        color: '#ffffff',
                      },
                    }}
                  />
                ))}
              </Stack>
            )}

            {/* Indicador escribiendo... */}
            {isTyping && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Avatar sx={{ bgcolor: '#ef4444', width: 24, height: 24 }}>
                  <SmartToyRoundedIcon sx={{ fontSize: '0.9rem' }} />
                </Avatar>
                <Typography variant="caption" sx={{ color: '#71717a', fontStyle: 'italic' }}>
                  Escribiendo respuesta...
                </Typography>
              </Box>
            )}

            <div ref={chatBottomRef} />
          </Box>

          {/* Caja de Entrada de Texto */}
          <Box sx={{ p: 1.5, bgcolor: '#09090b', borderTop: '1px solid #27272a' }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Escribe tu consulta..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: '#ffffff',
                  bgcolor: '#18181b',
                  borderRadius: 2,
                  '& fieldset': { borderColor: '#27272a' },
                  '&:hover fieldset': { borderColor: '#3f3f46' },
                  '&.Mui-focused fieldset': { borderColor: '#ef4444' },
                },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton 
                      onClick={() => sendMessage(input)} 
                      disabled={!input.trim()}
                      sx={{ color: input.trim() ? '#ef4444' : '#3f3f46' }}
                    >
                      <SendRoundedIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </Paper>
      </Zoom>

      {/* BURBUJA FLOTANTE */}
      <Fab
        aria-label="chat"
        onClick={() => setOpen(!open)}
        sx={{
          bgcolor: '#ef4444',
          color: '#ffffff',
          boxShadow: '0 4px 14px rgba(239, 68, 68, 0.4)',
          '&:hover': { bgcolor: '#dc2626' },
        }}
      >
        {open ? <CloseRoundedIcon /> : <SmartToyRoundedIcon />}
      </Fab>
    </Box>
  );
};