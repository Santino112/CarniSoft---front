import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Divider,
  InputAdornment,
  Alert
} from "@mui/material";
import { nuevaResService } from "../../dashboard.service";
import type { ResData } from "../../types";
import ScaleIcon from "@mui/icons-material/Scale";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import StorefrontIcon from "@mui/icons-material/Storefront";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

interface NuevaResProps {
  onIniciarDesposte?: (data: ResData) => void;
}

const NuevaRes: React.FC<NuevaResProps> = ({ onIniciarDesposte }) => {
  const [proveedor, setProveedor] = useState("");
  const [fechaCompra, setFechaCompra] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [pesoKg, setPesoKg] = useState<string>("");
  const [precioPorKg, setPrecioPorKg] = useState<string>("");

  //Variables del alert
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState<| 'success' | 'error' | 'warning' | 'info'>('error');

  //Estados
  const [isError, setIsError] = useState(false);
  const [isNuevaRes, setIsNuevaRes] = useState(false);

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

    const resultado = await nuevaResService(proveedor, fechaCompra, peso, precio);

    console.log('resultado:', resultado)

    if (!resultado.success) {
      setIsNuevaRes(false);
      setIsError(true);
      setAlertMessage(resultado.message);
      setAlertSeverity('error');
      setTimeout(() => {
        setIsError(false);
        setIsNuevaRes(false);
      }, 5000);
      return;
    };

    onIniciarDesposte?.({
      id: resultado.datosConsulta.data.id,
      proveedor,
      fecha: fechaCompra,
      pesoKg: peso,
      precioPorKg: precio,
    });

    setProveedor('');
    setFechaCompra(new Date().toISOString().split("T")[0]);
    setPesoKg('');
    setPrecioPorKg('');
    setIsNuevaRes(false);
  };

  return (
    <Box component='form' onSubmit={handleNuevaRes} sx={{ maxWidth: 560, mx: "auto", p: { xs: 2, sm: 4 }, bgcolor: "black", borderColor: "2px solid red" }}>
      <Typography variant="h5" fontWeight={600} gutterBottom>
        Nueva res
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={1}>
        Registrá los datos de la compra para iniciar el desposte.
      </Typography>
      <Divider sx={{ my: 1 }} />
      {isError && (
        <Alert
          variant='filled'
          severity={alertSeverity}
          sx={{
            width: 'fit-content',
            fontSize: '1rem',
            color: "#ffffff",
            borderRadius: 2,
          }}
        >
          {alertMessage}
        </Alert>
      )}
      <Paper variant="outlined" sx={{ p: 0, borderRadius: 3, mb: 3, bgcolor: "black", border: 'none' }}>
        <Typography variant="overline" color="text.secondary" fontWeight={600}>
          Datos de la compra
        </Typography>
        <Divider sx={{ my: 1 }} />

        <Box display="flex" flexDirection="column" gap={2.5} mt={2}>
          <TextField
            label="Proveedor"
            value={proveedor}
            onChange={(e) => setProveedor(e.target.value)}
            placeholder="Ej: Frigorífico Don Pedro"
            fullWidth
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
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <ScaleIcon fontSize="small" />
                    </InputAdornment>
                  ),
                  endAdornment: <InputAdornment position="end">kg</InputAdornment>,
                },
              }}
            />
            <TextField
              label="Precio por kg"
              type="number"
              value={precioPorKg}
              onChange={(e) => setPrecioPorKg(e.target.value)}
              fullWidth
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <AttachMoneyIcon fontSize="small" />
                    </InputAdornment>
                  ),
                  endAdornment: <InputAdornment position="end">$/kg</InputAdornment>,
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
          bgcolor: costoTotal > 0 ? "black" : "black",
          borderColor: costoTotal > 0 ? "primary.200" : "divider",
          transition: "all 0.2s ease",
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="overline" color="text.secondary" fontWeight={600}>
              Costo total de la res
            </Typography>
            <Typography variant="h4" fontWeight={700} color={costoTotal > 0 ? "primary.main" : "text.disabled"}>
              {costoTotal > 0 ? formatPesos(costoTotal) : "—"}
            </Typography>
          </Box>
          {peso > 0 && precio > 0 && (
            <Box textAlign="right">
              <Typography variant="caption" color="text.secondary">
                {peso} kg × {formatPesos(precio)}/kg
              </Typography>
            </Box>
          )}
        </Box>
      </Paper>
      <Box sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'column', md: 'row' },
        justifyContent: 'flex-end',
        gap: 2,
      }}>
        <Button
          variant="contained"
          size="large"
          fullWidth
          disabled={!canSubmit}
          sx={{
            fontSize: "1rem",
            mr: 1,
            borderRadius: 2,
            py: 1.5,
            textTransform: "none",
            backgroundColor: 'transparent'
          }}
        >
          Cancelar
        </Button>
        <Button
          variant="contained"
          size="large"
          type='submit'
          fullWidth
          disabled={!canSubmit || isNuevaRes}
          endIcon={<ArrowForwardIcon />}
          sx={{ borderRadius: 2, py: 1.5, fontWeight: 600 }}
        >
          Iniciar desposte
        </Button>
      </Box>
    </Box>
  );
};

export default NuevaRes;
