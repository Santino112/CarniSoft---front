import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Divider,
  InputAdornment,
  CircularProgress
} from "@mui/material";
import { useSnackbar } from "../../../../context/SnackbarContext";
import { useNuevaRes } from "../../hooks/registrarNuevaRes";
import type { ResData } from "../../types";
import ScaleIcon from "@mui/icons-material/Scale";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import StorefrontIcon from "@mui/icons-material/Storefront";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

interface NuevaResProps {
  onIniciarDesposte?: (data: ResData) => void;
  onCancelar?: () => void;
}

const NuevaRes: React.FC<NuevaResProps> = ({ onIniciarDesposte, onCancelar }) => {
  const [proveedor, setProveedor] = useState("");
  const [fechaCompra, setFechaCompra] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [pesoKg, setPesoKg] = useState<string>("");
  const [precioPorKg, setPrecioPorKg] = useState<string>("");

  const { showSnackbar } = useSnackbar();
  const [isNuevaRes, setIsNuevaRes] = useState(false);
  const { guardarNuevaRes, loadingGuardarRes } = useNuevaRes(onIniciarDesposte)

  const peso = parseFloat(pesoKg) || 0;
  const precio = parseFloat(precioPorKg) || 0;
  const costoTotal = peso * precio;

  const formatPesos = (n: number) =>
    n.toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });

  const canSubmit = proveedor.trim() !== "" && peso > 0 && precio > 0;

  //Manejo del agregado de la res
  const handleNuevaRes = async (e: any) => {
    e.preventDefault();
    setIsNuevaRes(true);

    const resultado = await guardarNuevaRes(proveedor, fechaCompra, peso, precio);

    if (!resultado.success) {
      setIsNuevaRes(false);
      showSnackbar(resultado.message, 'error');
      return;
    };

    setProveedor('');
    setFechaCompra(new Date().toISOString().split("T")[0]);
    setPesoKg('');
    setPrecioPorKg('');
    setIsNuevaRes(false);
    showSnackbar(resultado.message, 'success');
  };

  return (
    <Box component='form' onSubmit={handleNuevaRes} sx={{ maxWidth: 560, mx: "auto", p: { xs: 2.3, sm: 4 }, bgcolor: "background.default", border: 'none' }}>
      <Typography variant="h5" mb={1} fontWeight={600}>
        Nueva res
      </Typography>
      <Typography variant="body2" mb={2} sx={{ fontSize: '1rem' }}>
        Registrá los datos de la compra para iniciar el desposte.
      </Typography>
      <Divider sx={{ my: 1 }} />
      <Paper variant="outlined" sx={{ p: 0, borderRadius: 3, mb: 3, bgcolor: "background.default", border: 'none' }}>
        <Typography variant="overline">
          Datos de la compra
        </Typography>
        <Box display="flex" flexDirection="column" gap={2.5} mt={2}>
          <TextField
            label="Proveedor"
            value={proveedor}
            onChange={(e) => setProveedor(e.target.value)}
            placeholder="Ej: Frigorífico Don Pedro"
            fullWidth
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
              }
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <StorefrontIcon fontSize="small" />
                  </InputAdornment>
                ),
              },
            }}
          />

          <TextField
            label="Fecha de compra"
            type="date"
            value={fechaCompra}
            onChange={(e) => setFechaCompra(e.target.value)}
            fullWidth
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
              }
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <CalendarTodayIcon fontSize="small" />
                  </InputAdornment>
                ),
              },
              inputLabel: { shrink: true },
            }}
          />

          <Box display="flex" gap={2}>
            <TextField
              label="Peso total"
              type="number"
              value={pesoKg}
              onChange={(e) => setPesoKg(e.target.value)}
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                }
              }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <ScaleIcon fontSize="small" />
                    </InputAdornment>
                  ),
                  endAdornment: <InputAdornment position="end">Kg</InputAdornment>,
                },
              }}
            />
            <TextField
              label="Precio por kg"
              type="number"
              value={precioPorKg}
              onChange={(e) => setPrecioPorKg(e.target.value)}
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                }
              }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <AttachMoneyIcon fontSize="small" />
                    </InputAdornment>
                  ),
                  endAdornment: <InputAdornment position="end">$/Kg</InputAdornment>,
                },
              }}
            />
          </Box>
        </Box>
      </Paper>

      <Paper
        variant="outlined"
        sx={{
          p: 2,
          borderRadius: 3,
          mb: 3,
          bgcolor: costoTotal > 0 ? "background.default" : "transparent",
          borderColor: costoTotal > 0 ? "primary.200" : "divider",
          transition: "all 0.2s ease",
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="overline">
              Costo total de la res
            </Typography>
            <Typography variant="h4" fontWeight={700} color={costoTotal > 0 ? "primary.main" : "text.disabled"}>
              {costoTotal > 0 ? formatPesos(costoTotal) : "—"}
            </Typography>
          </Box>
          {peso > 0 && precio > 0 && (
            <Box textAlign="right">
              <Typography variant="caption">
                {peso} kg × {formatPesos(precio)}/kg
              </Typography>
            </Box>
          )}
        </Box>
      </Paper>
      <Divider sx={{ mb: 2 }} />
      <Box sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'column', md: 'row' },
        justifyContent: 'flex-end',
        gap: 2,
      }}>

        <Button
          variant="contained"
          size="large"
          type='submit'
          fullWidth
          disabled={!canSubmit || isNuevaRes}
          sx={{ borderRadius: 3, textTransform: 'none', fontSize: '1rem' }}
        >
          {loadingGuardarRes ? (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CircularProgress
                size={20}
                sx={{
                  color: "#ffffff",
                  marginRight: "10px"
                }}
              />
              <span>Iniciando...</span>
            </Box>
          ) : (
            <Typography sx={{ display: 'flex', alignItems: 'center' }}>Iniciar desposte<ArrowForwardIcon sx={{ ml: 1 }} /></Typography>
          )}
        </Button>
        <Button
          variant="contained"
          onClick={onCancelar}
          size="large"
          fullWidth
          sx={{
            fontSize: "1rem",
            mr: 1,
            mb: { xs: 1, sm: 1, md: 0 },
            borderRadius: 3,
            textTransform: "none",
            backgroundColor: 'transparent',
            boxShadow: 2,
            color: "#ffffff",
            "&:hover": { backgroundColor: "#454546" },
          }}
        >
          Cancelar
        </Button>
      </Box>
    </Box>
  );
};

export default NuevaRes;
