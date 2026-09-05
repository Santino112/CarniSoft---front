import { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  LinearProgress,
  Chip,
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  InputAdornment,
  Alert,
  Select,
  MenuItem,
  FormControl,
  Stack,
  InputLabel,
  CircularProgress,
} from "@mui/material";
import { useHistorialReses } from "../../hooks/historialReses";
import { useFiltrarCortes } from "../../hooks/filtrarCortes";
import { useRegistrarVenta } from "../../hooks/registrarVenta";
import { useSnackbar } from "../../../../context/SnackbarContext";
import type { Corte } from "../../types";
import PointOfSaleRoundedIcon from '@mui/icons-material/PointOfSaleRounded';
import SavingsRoundedIcon from '@mui/icons-material/SavingsRounded';
import AccountBalanceWalletRoundedIcon from '@mui/icons-material/AccountBalanceWalletRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import TrendingDownRoundedIcon from '@mui/icons-material/TrendingDownRounded';
import ListAltRoundedIcon from '@mui/icons-material/ListAltRounded';
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import LocalShippingRoundedIcon from '@mui/icons-material/LocalShippingRounded';
import TrackChangesRoundedIcon from '@mui/icons-material/TrackChangesRounded';
import ScaleIcon from "@mui/icons-material/Scale";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const DIAS_ALERTA = 2;
const DIAS_CRITICO = 4;

const Seguimiento = ({ }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCorte, setSelectedCorte] = useState<Corte | null>(null);
  const [kgVenta, setKgVenta] = useState("");
  const [res, setRes] = useState('');
  const { reses } = useHistorialReses(true);
  const resSeleccionada = reses.find(r => r.id === res);
  const { cortesFiltrados, filtrarCortes, loadingCortes } = useFiltrarCortes();
  const { registrarVentaRealizada, loadingVenta } = useRegistrarVenta();
  const { showSnackbar } = useSnackbar();
  let [hayResSeleccionada, setHayResSeleccionada] = useState(false);
  const todosAgotados = cortesFiltrados.every(c => c.kgVendido >= c.kgTotal)

  const costoTotal = (resSeleccionada?.peso_total ?? 0) * (resSeleccionada?.precio_kg ?? 0);
  const cantidadDeCortes = cortesFiltrados.length;
  const ingresoRecuperado = cortesFiltrados.reduce(
    (sum, c) => sum + c.kgVendido * c.precioPorKg, 0
  );
  const ingresoRestante = cortesFiltrados.reduce(
    (sum, c) => sum + Math.max(c.kgTotal - c.kgVendido, 0) * c.precioPorKg, 0
  );
  const todoVendido = ingresoRestante === 0;
  const pctEquilibrio = Math.min((ingresoRecuperado / costoTotal) * 100, 100);
  const superoPuntoEquilibrio = ingresoRecuperado >= costoTotal;
  const gananciaActual = ingresoRecuperado - costoTotal;

  const diasDesdeCompra = resSeleccionada?.fecha_compra
    ? Math.floor(
      (Date.now() - new Date(resSeleccionada.fecha_compra).getTime()) / (1000 * 60 * 60 * 24)
    )
    : '-/-';

  const formatPesos = (n: number) =>
    n.toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });

  const getEstado = (c: Corte) => {
    if (c.kgVendido >= c.kgTotal) return "agotado";
    if (c.diasSinMovimiento >= DIAS_CRITICO) return "critico";
    if (c.diasSinMovimiento >= DIAS_ALERTA) return "lento";
    return "activo";
  };

  const estadoChipConDias = (c: Corte) => {
    const estado = getEstado(c);

    const labels: Record<string, string> = {
      agotado: "Agotado",
      activo: "Activo",
      lento: `${c.diasSinMovimiento}d sin mover`,
      critico: `${c.diasSinMovimiento}d sin mover`,
    };

    const colors: Record<string, "success" | "warning" | "error" | "default"> = {
      agotado: "success",
      activo: "default",
      lento: "warning",
      critico: "error",
    };

    const customStyles: Record<string, object> = {
      activo: {
        bgcolor: 'rgba(34, 197, 94, 0.15)',
        color: '#4ade80',
        border: '1px solid rgba(34, 197, 94, 0.3)',
        fontWeight: 600,
      },
    };

    return (
      <Chip
        label={labels[estado]}
        color={colors[estado]}
        size="medium"
        sx={customStyles[estado]}
      />
    );
  };

  const handleAbrirVenta = (c: Corte) => {
    setSelectedCorte(c);
    setKgVenta("");
    setDialogOpen(true);
  };

  const handleConfirmarVenta = async () => {
    if (!selectedCorte) return;
    const kg = parseFloat(kgVenta) || 0;
    if (kg <= 0) return;

    if (kg > selectedCorte.kgRestante) {
      showSnackbar(`No podes vender más de ${selectedCorte.kgRestante} Kg disponbles.`, 'error');
      return;
    }

    await registrarVentaRealizada(selectedCorte.id, kg, selectedCorte.precioPorKg, new Date().toISOString().split('T')[0]);

    setDialogOpen(false);
    setKgVenta('');
    filtrarCortes(res);
  };

  const cortesConAlerta = cortesFiltrados.filter((c) => c.diasSinMovimiento >= DIAS_ALERTA && c.kgVendido < c.kgTotal);

  const handleChange = (event: any) => {
    setRes(event.target.value);
  };

  //TODO: Esto lo que hace es formatear la fecha que viene de supabase a algo entendible
  const formatearFecha = (fechaTexto: any) => {
    if (!fechaTexto) return '-/-';
    const fecha = new Date(fechaTexto);

    return fecha.toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      timeZone: 'UTC'
    });
  };

  const ActionSelect = ({ isMobile = false }) => (
    <Stack
      direction="column"
      sx={{
        display: isMobile ? { xs: "flex", md: "none" } : { xs: "none", md: "flex" },
        mt: isMobile ? 2 : 0,
        mb: isMobile ? 1 : 0,
        width: isMobile ? "100%" : "auto",
      }}
    >
      <FormControl
        fullWidth
        sx={{
          width: { xs: "100%", sm: 400 },
          maxWidth: "100%",
          mb: 1,
          mt: { xs: 1, sm: 1, md: 0 },
        }}
      >
        <InputLabel
          id="select-reses-label"
          sx={{ color: "#fff", "&.Mui-focused": { color: "#fff" } }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LocalShippingRoundedIcon fontSize="small" />
            Lista de reses compradas
          </Box>
        </InputLabel>
        <Select
          labelId="select-reses-label"
          value={res}
          label="Reses compradas"
          onChange={handleChange}
          sx={{
            backgroundColor: "#1c1c1c",
            color: "#ffffff",
            width: "100%",
            borderRadius: 3,
            boxShadow: 4,
            transition: "all 0.2s ease-in-out",
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#3f3f46",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#ff0101",
              borderWidth: "1.5px",
            },
            ".MuiSelect-icon": {
              color: "#ffffff",
              transition: "transform 0.2s ease-in-out",
            },
            "&.Mui-focused .MuiSelect-icon": {
              color: "#ffffff",
            },
          }}
          MenuProps={{
            PaperProps: {
              sx: {
                backgroundColor: "#1c1c1c",
                color: "#f4f4f5",
                borderRadius: 3,
                marginTop: 1,
                maxHeight: 300,
                maxWidth: "calc(100vw - 32px)",
                border: "1px solid #1c1c1c",
                boxShadow:
                  4,
                "& .MuiList-root": {
                  p: 1,
                },
                "& .MuiMenuItem-root": {
                  borderRadius: 3,
                  py: 1,
                  px: 2,
                  my: 0.7,
                  mr: 1,
                  fontSize: "0.925rem",
                  color: "#ffffff",
                  whiteSpace: "normal",
                  wordBreak: "break-word",
                  transition: "all 0.15s ease-in-out",
                  "&:hover": {
                    backgroundColor: "#454546",
                    color: "#ffffff",
                  },
                  "&.Mui-selected": {
                    backgroundColor: "#454546",
                    color: "#ffffff",
                    fontWeight: 600,
                    "&:hover": {
                      backgroundColor: "#454546"
                    },
                  },
                },
              },
            },
          }}
        >
          <MenuItem value="" onClick={() => setHayResSeleccionada(false)}>
            <em>Ninguno</em>
          </MenuItem>
          {reses.map((res) => (
            <MenuItem
              key={res?.id}
              value={res?.id}
              onClick={() => {
                filtrarCortes(res?.id);
                setHayResSeleccionada(true);
              }}
            >
              {res?.proveedor} - {res?.peso_total} Kg - {formatearFecha(res?.fecha_compra)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Stack>
  );

  const BoxTitutloDatosSeguimiento = ({ isMobile = false }) => (
    <Stack sx={{
      display: isMobile ? { xs: "flex", md: "none" } : { xs: "none", md: "flex" },
      width: isMobile ? "100%" : "auto",
      m: 0,
      position: 'relative',
      top: '17px',
      left: '2px'
    }}
    >
      <Typography variant="overline" fontWeight={600}>
        Control de progreso
      </Typography>
    </Stack>
  );

  return (
    <Box sx={{
      flexGrow: 1,
      width: "100%",
      height: "100%",
      overflow: "auto",
      p: { xs: 2, sm: 3, md: 4 },
      mt: { xs: 1, sm: 0 },
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
    }}>
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
        <Box>
          <Typography variant="h5" fontWeight={600} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <TrackChangesRoundedIcon fontSize='small' sx={{ mr: 1 }} />Seguimiento
          </Typography>
          <Typography variant="body2">
            Res del {formatearFecha(resSeleccionada?.fecha_compra)} | Día {diasDesdeCompra}
          </Typography>
        </Box>
        <ActionSelect isMobile={false} />
        <Button
          variant="contained"
          startIcon={<PointOfSaleRoundedIcon />}
          onClick={() => setDialogOpen(true)}
          sx={{
            borderRadius: 3,
            fontWeight: 600,
            textTransform: "none",
            boxShadow: "0 0 16px rgba(252, 0, 0, 0.45)",
            transition: "box-shadow 0.3s ease, background-color 0.3s ease, transform 0.2s ease",
            "&:hover": {
              boxShadow: "none",
              transform: "translateY(-1px)",
            },
          }}
        >
          Registrar venta
        </Button>
      </Box>
      <ActionSelect isMobile={true} />
      <Box mt={3} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="overline" fontWeight={600}>
            Cortes asociados a la res seleccionada
          </Typography>
        </Box>
        <Box sx={{ display: { xs: 'none', sm: 'none', md: 'block' } }}>
          <Typography variant="overline" fontWeight={600}>
            Control de progreso
          </Typography>
        </Box>
      </Box>
      <Stack flexDirection={{ xs: 'column', sm: 'column', md: 'row' }} gap={2} sx={{ mb: 3, width: '100%' }}>
        <Paper variant="outlined" sx={{ borderRadius: 3, boxShadow: 4, border: 'none', width: '100%', fontSize: '1rem', overflow: 'hidden', bgcolor: "#1c1c1c" }}>
          <TableContainer sx={{ maxHeight: 320, minHeight: 100 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow sx={{ bgcolor: "black" }}>
                  <TableCell sx={{ fontWeight: 600, bgcolor: "#1c1c1c" }} align="center">Nombre del corte</TableCell>
                  <TableCell sx={{ fontWeight: 600, bgcolor: "#1c1c1c" }} align="center">Kg asignados</TableCell>
                  <TableCell sx={{ fontWeight: 600, bgcolor: "#1c1c1c" }} align="center">Precio por kg</TableCell>
                  <TableCell sx={{ fontWeight: 600, bgcolor: "#1c1c1c" }} align="center">Proveedor</TableCell>
                  <TableCell sx={{ fontWeight: 600, bgcolor: "#1c1c1c" }} align="center">Fecha de desposte</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loadingCortes ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ border: 'none' }}>
                      <CircularProgress
                        size={50}
                        sx={{
                          color: "#ffffff",
                          marginTop: "20px",
                          marginLeft: '20px'
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ) : !hayResSeleccionada ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ border: 'none' }}>
                      <Typography variant="body2" fontWeight={500} sx={{ marginLeft: '20px', fontSize: '1rem' }}>
                        No hay una res seleccionada.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  cortesFiltrados.map((c) => {
                    return (
                      <TableRow key={c.id} hover>
                        <TableCell align="center" sx={{ border: 'none' }}>
                          <Typography>{c.nombre}</Typography>
                        </TableCell>
                        <TableCell align="center" sx={{ border: 'none' }}>
                          <Typography>{c.kgTotal} Kg</Typography>
                        </TableCell>
                        <TableCell align="center" sx={{ border: 'none' }}>
                          <Typography>{formatPesos(c.precioPorKg)}</Typography>
                        </TableCell>
                        <TableCell align="center" sx={{ border: 'none' }}>
                          <Typography>{resSeleccionada?.proveedor}</Typography>
                        </TableCell>
                        <TableCell align="center" sx={{ border: 'none' }}>
                          <Typography>{formatearFecha(c.creado_en)}</Typography>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
        <BoxTitutloDatosSeguimiento isMobile={true} />
        <Box display="flex" gap={1} flexWrap="wrap">
          <Stack flexDirection={'row'} gap={1} sx={{ width: '100%' }}>
            <Paper variant="outlined" sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', borderRadius: 3, bgcolor: "#1c1c1c", border: 'none', boxShadow: 4 }}>
              <Typography variant="body2" fontWeight={600} sx={{ mb: 1, display: 'flex', alignItems: 'center' }}><SavingsRoundedIcon sx={{ mr: 1 }} />Recuperado</Typography>
              {loadingCortes ? (
                <CircularProgress
                  size={25}
                  sx={{
                    color: "#ffffff",
                    mt: 0.70
                  }}
                />
              ) : hayResSeleccionada ? (
                <Typography variant="h5" fontWeight={700} color="success.main">
                  {(formatPesos(ingresoRecuperado))}
                </Typography>
              ) : (
                <Typography variant="h5" fontWeight={700}>-/-</Typography>
              )}
            </Paper>
            <Paper variant="outlined" sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', minWidth: 140, p: 2, borderRadius: 3, bgcolor: "#1c1c1c", border: 'none', boxShadow: 4 }}>
              <Typography variant="body2" fontWeight={600} sx={{ mb: 1, display: 'flex', alignItems: 'center' }}><AccountBalanceWalletRoundedIcon sx={{ mr: 1 }} />Por vender</Typography>
              {loadingCortes ? (
                <CircularProgress
                  size={25}
                  sx={{
                    color: "#ffffff",
                    mt: 0.70
                  }}
                />
              ) : !hayResSeleccionada ? (
                <Typography variant="h5" fontWeight={600} color="text.primary">-/-</Typography>
              ) : todoVendido && ingresoRecuperado !== 0 ? (
                <Typography variant="body2" sx={{ mb: 0.70 }}>
                  Ya se vendió todo
                </Typography>
              ) : (
                <Typography variant="h5" fontWeight={600} color="text.primary">{formatPesos(ingresoRestante)}</Typography>
              )}
            </Paper>
          </Stack>
          <Stack flexDirection={'row'} gap={1} sx={{ width: '100%' }}>
            <Paper
              variant="outlined"
              sx={{
                flex: 1,
                minWidth: 140,
                p: 2,
                borderRadius: 3,
                bgcolor: "#1c1c1c", border: 'none',
                boxShadow: superoPuntoEquilibrio && ingresoRecuperado !== 0 && hayResSeleccionada
                  ? (theme) => `0 0 12px ${theme.palette.success.main}`
                  : 4,
                display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'
              }}
            >
              <Typography variant="body2" fontWeight={600} sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                {superoPuntoEquilibrio && ingresoRecuperado !== 0 && hayResSeleccionada ?
                  <>
                    <TrendingUpRoundedIcon sx={{ mr: 1 }} /> Ganancia actual
                  </>
                  :
                  <>
                    <TrendingDownRoundedIcon sx={{ mr: 1 }} /> Falta para equilibrio
                  </>
                }
              </Typography>
              {loadingCortes ? (
                <CircularProgress
                  size={25}
                  sx={{
                    color: "#ffffff",
                    mt: 0.70
                  }}
                />
              ) : !hayResSeleccionada ? (
                <Typography variant="h5" fontWeight={600} color="text.primary">-/-</Typography>
              ) : (
                <Typography
                  variant="h5"
                  fontWeight={700}
                  color={superoPuntoEquilibrio && ingresoRecuperado !== 0 ? "success.main" : "warning.main"}
                >
                  {superoPuntoEquilibrio && ingresoRecuperado !== 0
                    ? formatPesos(gananciaActual)
                    : formatPesos(costoTotal - ingresoRecuperado)}
                </Typography>
              )}
            </Paper>
            <Paper variant="outlined" sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', minWidth: 140, p: 2, borderRadius: 3, bgcolor: "#1c1c1c", border: 'none', boxShadow: 4 }}>
              <Typography variant="body2" fontWeight={600} sx={{ mb: 1, display: 'flex', alignItems: 'center' }}><ListAltRoundedIcon sx={{ mr: 1 }} />Num. de cortes</Typography>
              {loadingCortes ? (
                <CircularProgress
                  size={25}
                  sx={{
                    color: "#ffffff",
                    mt: 0.70
                  }}
                />
              ) : !hayResSeleccionada ? (
                <Typography variant="h5" fontWeight={600} color="text.primary">-/-</Typography>
              ) : (
                <Typography variant="h5" fontWeight={600} color="text.primary">
                  {(cantidadDeCortes)}
                </Typography>
              )}
            </Paper>
          </Stack>
        </Box>
      </Stack>

      <Paper variant="outlined" sx={{
        p: 2.5,
        borderRadius: 3,
        mb: { xs: 2, sm: 2, md: 2.5 },
        bgcolor: "#1c1c1c",
        border: 'none',
        boxShadow: superoPuntoEquilibrio && ingresoRecuperado !== 0 && hayResSeleccionada
          ? (theme) => `0 0 12px ${theme.palette.success.main}`
          : 4,
      }}>
        <Box display="flex" justifyContent="space-between" mb={2}>
          <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="body2" fontWeight={500}>
              Equilibrio
            </Typography>
          </Box>
          {ingresoRecuperado !== 0 && resSeleccionada ? (
            <Typography variant="body2" fontWeight={500}>
              {pctEquilibrio.toFixed(0)}% — {(formatPesos(ingresoRecuperado))} de {(formatPesos(costoTotal))}
            </Typography>
          ) : (
            <Typography variant="body2" fontWeight={500}>
              Todavía no hay datos cargados.
            </Typography>
          )}
        </Box>
        <LinearProgress
          variant="determinate"
          value={pctEquilibrio}
          color={superoPuntoEquilibrio && ingresoRecuperado !== 0 && hayResSeleccionada ? "success" : "primary"}
          sx={{ height: 10, borderRadius: 5 }}
        />
        {superoPuntoEquilibrio && ingresoRecuperado !== 0 && hayResSeleccionada && (
          <Typography variant="caption" fontWeight={600} color="success.main" mt={1} display="block" sx={{ fontSize: '1rem', mt: 1.5 }}>
            Ya cubriste el costo de la res. Todo lo que vendas de acá en adelante es considerado ganancia.
          </Typography>
        )}
      </Paper>

      <Box>
        {cortesConAlerta.length > 0 && hayResSeleccionada && (
          <Alert
            variant="filled"
            severity="warning"
            icon={<WarningAmberIcon />}
            sx={{ mb: 2, borderRadius: 3, boxShadow: 4, fontSize: '1rem' }}
          >
            {cortesConAlerta.map((c) => c.nombre).join(", ")}{" "}
            {cortesConAlerta.length === 1 ? "lleva" : "llevan"} varios días sin venderse.
            Considerá bajar el precio antes de que se pierda.
          </Alert>
        )}
      </Box>

      <Box px={0.25} mt={2}>
        <Typography variant="overline" fontWeight={600}>
          Estado por corte
        </Typography>
      </Box>
      <Paper variant="outlined" sx={{ borderRadius: 3, overflow: "hidden", bgcolor: "#1c1c1c", border: 'none', boxShadow: 4, minHeight: 100, mb: { xs: 3.7, sm: 3, md: 2 } }}>
        <TableContainer sx={{ maxHeight: 600, minHeight: 200 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow sx={{ bgcolor: "black" }}>
                <TableCell sx={{ fontWeight: 600, bgcolor: "#1c1c1c" }} align="center">Corte</TableCell>
                <TableCell sx={{ fontWeight: 600, bgcolor: "#1c1c1c" }} align="center">Cantidad vendida</TableCell>
                <TableCell sx={{ fontWeight: 600, bgcolor: "#1c1c1c" }} align="center">Kg que restan</TableCell>
                <TableCell sx={{ fontWeight: 600, bgcolor: "#1c1c1c" }} align="center">Ingreso total</TableCell>
                <TableCell sx={{ fontWeight: 600, bgcolor: "#1c1c1c" }} align="center">Estado</TableCell>
                <TableCell sx={{ fontWeight: 600, bgcolor: "#1c1c1c" }} align="center">Acción</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loadingCortes ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ border: 'none' }}>
                    <CircularProgress
                      size={50}
                      sx={{
                        color: "#ffffff",
                        marginTop: "30px",
                        marginLeft: '65px'
                      }}
                    />
                  </TableCell>
                </TableRow>
              ) : !hayResSeleccionada ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ border: 'none' }}>
                    <Typography variant="body2" fontWeight={500} sx={{ marginLeft: '65px', fontSize: '1rem' }}>
                      No hay una res seleccionada.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                cortesFiltrados.map((c) => {
                  const pct = (c.kgVendido / c.kgTotal) * 100;
                  const agotado = c.kgVendido >= c.kgTotal;
                  return (
                    <TableRow key={c.id} hover sx={{ border: 'none' }}>
                      <TableCell align="center" sx={{ border: 'none' }}>
                        <Typography fontWeight={500}>{c.nombre}</Typography>
                        <Typography color="text.secondary">
                          {(formatPesos(c.precioPorKg))}/kg
                        </Typography>
                      </TableCell>
                      <TableCell align="center" sx={{ border: 'none' }}>
                        <Typography>
                          {c.kgVendido.toFixed(1)} / {c.kgTotal} Kg
                        </Typography>
                        <Box display='flex' justifyContent='center'>
                          <LinearProgress
                            variant="determinate"
                            value={pct}
                            color={agotado ? "success" : "primary"}
                            sx={{ height: 4, borderRadius: 2, mt: 0.5, width: 80 }}
                          />
                        </Box>
                      </TableCell>
                      <TableCell align="center" sx={{ border: 'none' }}>
                        {!agotado ? (
                          <Typography color="body2">
                            Restan {c.kgRestante.toFixed(1)} kg
                          </Typography>
                        ) : (
                          <Typography color="text.secondary">
                            ---/---
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell align="center" sx={{ border: 'none' }}>
                        <Typography color="success.main" fontWeight={500}>
                          {(formatPesos(c.ingreso))}
                        </Typography>
                      </TableCell>
                      <TableCell align="center" sx={{ border: 'none' }}>{estadoChipConDias(c)}</TableCell>
                      <TableCell align="center" sx={{ border: 'none' }}>
                        {!agotado ? (
                          <Button
                            size="small"
                            variant="contained"
                            onClick={() => handleAbrirVenta(c)}
                            sx={{ borderRadius: 3, textTransform: 'none', fontSize: '1rem' }}
                          >
                            Vender
                          </Button>
                        ) : (
                          <Typography variant="body2" fontWeight={500}>Ya vendiste todo el corte</Typography>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        PaperProps={{ sx: { borderRadius: 3, bgcolor: "#1c1c1c", border: 'none' } }}
        fullWidth
        maxWidth="xs"
      >
        <DialogContent sx={{ bgcolor: "#1c1c1c", border: 'none' }}>
          <Typography variant="h5" mb={1} fontWeight={600} sx={{display: 'flex', alignItems: 'center'}}>
            {selectedCorte ? (
              <>
                Vender — {""}
                <Box component="span" sx={{ color: "primary.main", ml: 1 }}>
                   {selectedCorte.nombre}
                </Box>
              </>
            ) : (
              <>
                <PointOfSaleRoundedIcon sx={{mr: 1}}/>Registrar venta
              </>
            )}
          </Typography>
          {!resSeleccionada ? (
            <Typography variant="body2" fontWeight={500} sx={{ fontSize: '1rem' }}>No hay una res seleccionada. Seleccione una para ver los cortes a vender.</Typography>
          ) : !selectedCorte ? (
            <>
              <Typography variant="body2" mb={1} sx={{ color: "#ffffff", fontSize: '1rem' }}>
                Seleccioná el corte que quieres vender:
              </Typography>
              {!todosAgotados ? (
                <Box mb={1} sx={{ bgcolor: "#111111", border: 'none', p: 1.3, borderRadius: 3 }}>
                  <Box display="flex" flexWrap="wrap" flexDirection='row' gap={1} >
                    {cortesFiltrados
                      .filter((c) => c.kgVendido < c.kgTotal)
                      .map((c) => (
                        <Chip
                          key={c.id}
                          label={`${c.nombre} (${(c.kgTotal - c.kgVendido).toFixed(1)} kg)`}
                          onClick={() => setSelectedCorte(c)}
                          sx={{ cursor: "pointer", bgcolor: "#373737", fontSize: '1rem', boxShadow: 4 }}
                        />
                      ))}
                  </Box>
                </Box>
              ) : (
                <Typography variant="body2" fontWeight={500} sx={{fontSize: '1rem', mt: 2}}>Ya vendiste todos los cortes</Typography>
              )}
            </>
          ) : (
            <Box sx={{ bgcolor: "#1c1c1c", border: 'none', width: '100%' }}>
              <Typography variant="body2" mb={2} sx={{ fontSize: '1rem' }}>
                Disponible: {(selectedCorte.kgTotal - selectedCorte.kgVendido).toFixed(1)} Kg ·{" "}
                {(selectedCorte.precioPorKg)}/Kg
              </Typography>
              <TextField
                label="Kilos vendidos"
                type="number"
                value={kgVenta}
                onChange={(e) => setKgVenta(e.target.value)}
                fullWidth
                autoFocus
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
              {kgVenta && parseFloat(kgVenta) > 0 && (
                <Typography variant="body2" fontWeight={600} color="success.main" mt={1} sx={{ fontSize: '1rem' }}>
                  Ingreso por esta venta: {formatPesos((parseFloat(kgVenta) * selectedCorte.precioPorKg))}
                </Typography>
              )}
            </Box>
          )
          }
        </DialogContent>
        <DialogActions sx={{ display: 'flex', gap: 1.5, flexDirection: { xs: 'column', sm: 'column', md: 'row' }, alignItems: 'center', px: 2.3, pb: 2.4, bgcolor: "#1c1c1c" }}>
          {selectedCorte && (
            <Button
              variant="contained"
              endIcon={<ArrowForwardIcon/>}
              onClick={handleConfirmarVenta}
              disabled={!selectedCorte || !kgVenta || parseFloat(kgVenta) <= 0 || loadingVenta}
              sx={{ borderRadius: 3, color: "#ffffff", textTransform: "none", fontSize: '1rem', width: { xs: '100%', sm: '100%', md: '60%' }, mx: 0.50 }}
            >
              {loadingVenta ? (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CircularProgress
                    size={20}
                    sx={{
                      color: "#ffffff",
                      marginRight: "10px"
                    }}
                  />
                  <span>Confirmando...</span>
                </Box>
              ) : (
                'Confirmar venta'
              )}
            </Button>
          )}
          <Button
            onClick={() => { setDialogOpen(false); setSelectedCorte(null); }}
            sx={{
              fontSize: "1rem",
              mr: 1,
              width: { xs: '100%', sm: '100%', md: '30%' },
              borderRadius: 3,
              textTransform: "none",
              backgroundColor: 'transparent',
              boxShadow: 2,
              color: "#ffffff",
              "&:hover": { backgroundColor: "#454546" },
            }}>
            {!resSeleccionada ? (
              <span>Aceptar</span>
            ) : (
              <span>Cancelar</span>
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Seguimiento;
