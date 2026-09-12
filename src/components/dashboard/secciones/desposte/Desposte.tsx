import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Divider,
  IconButton,
  LinearProgress,
  Chip,
  InputAdornment,
  Dialog,
  DialogContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Stack,
  Alert,
  CircularProgress
} from "@mui/material";
import NuevaRes from "../nuevasCarnes/NuevaRes";
import { useGuardarDesposte } from "../../hooks/desposte";
import { useHistorialReses } from "../../hooks/historialReses";
import { useFiltrarCortes } from "../../hooks/filtrarCortes";
import type { ResData, CortesNuevos, ResHistorial } from "../../types";
import ContentCutRoundedIcon from '@mui/icons-material/ContentCutRounded';
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import LocalShippingRoundedIcon from '@mui/icons-material/LocalShippingRounded';
import ScaleIcon from '@mui/icons-material/Scale';
import PaymentsRoundedIcon from '@mui/icons-material/PaymentsRounded';
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import EventRoundedIcon from '@mui/icons-material/EventRounded';

interface DesposteProps {
  onGuardar?: (cortes: CortesNuevos[]) => void;
}

const CORTES_SUGERIDOS = [
  "Asado", "Vacío", "Cuadril", "Lomo", "Bife ancho",
  "Bife angosto", "Nalga", "Peceto", "Paleta", "Osobuco",
  "Matambre", "Tapa de asado", "Recorte", "Hueso",
];

let nextId = 1;

const Desposte: React.FC<DesposteProps> = () => {
  const [resActual, setResActual] = useState<ResData | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [cortes, setCortes] = useState<CortesNuevos[]>([]);
  const { reses, loadingReses, refetchReses } = useHistorialReses();
  const { cortesFiltrados, filtrarCortes, limpiarCortes, loadingCortes } = useFiltrarCortes();
  //TODO: Variables de calculo
  const pesoTotal = resActual?.pesoKg ?? 0;
  const costoTotal = resActual ? resActual?.pesoKg * resActual?.precioPorKg : 0;
  const formatPesos = (n: number) =>
    n.toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });
  const totalKgAsignados = cortes.reduce((sum, c) => sum + (c.kg || 0), 0);
  const mermaKg = pesoTotal - totalKgAsignados;
  //const mermaPct = pesoTotal > 0 ? (mermaKg / pesoTotal) * 100 : 0;
  const progresoAsignado = Math.min((totalKgAsignados / pesoTotal) * 100, 100);
  const ingresoTotal = cortes.reduce((sum, c) => sum + (c.kg || 0) * (c.precio_por_kg || 0), 0);
  const costoRealPorKg = totalKgAsignados > 0 ? costoTotal / totalKgAsignados : 0;
  const { guardarDesposte, loadingDesposte } = useGuardarDesposte();

  //TODO: Esto lo que hace es formatear la fecha que viene de supabase a algo entendible
  const formatearFecha = (fechaTexto: any) => {
    if (!fechaTexto || fechaTexto === '-/-') return '-/-';

    const fecha = new Date(fechaTexto);
    if (isNaN(fecha.getTime())) return '-/-';

    return fecha.toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      timeZone: 'UTC'
    });
  };

  const handleGuardar = async (cortes: CortesNuevos[]) => {
    if (!resActual?.id) return;

    const exito = await guardarDesposte(resActual.id, cortes);

    if (exito) {
      finalizarDesposte()
    };
  };

  const handleCargarRes = async (res: ResHistorial) => {
    const resData = {
      id: res.id,
      proveedor: res.proveedor,
      fecha: res.fecha_compra,
      pesoKg: res.peso_total,
      precioPorKg: res.precio_kg
    };
    setResActual(resData);
    localStorage.setItem('desposte_resActual', JSON.stringify(resData));

    filtrarCortes(res.id);
  };

  const resYaDespostada = resActual ?
    reses.find(r => r.id === resActual.id)?.despostada ?? false
    : false

  useEffect(() => {
    if (resActual) {
      localStorage.setItem('desposte_resActual_${user.id}', JSON.stringify(resActual));
    }
  }, [resActual]);

  useEffect(() => {
    if (resActual?.id) {
      filtrarCortes(resActual.id)
    }
  }, [resActual])

  useEffect(() => {
    const resGuardada = localStorage.getItem('desposte_resActual_${user.id}');

    if (resGuardada) setResActual(JSON.parse(resGuardada));
  }, []);

  const finalizarDesposte = () => {
    localStorage.removeItem('desposte_resActual_${user.id}');
    localStorage.removeItem('desposte_corte_${user.id}');
    setResActual(null);
    limpiarCortes();
    refetchReses();
  };

  const addCorte = (nombre = "") => {
    setCortes((prev) => [...prev, { id: nextId++, nombre, kg: 0, precio_por_kg: 0 }]);
  };

  const removeCorte = (id: number | string) => {
    setCortes((prev) => prev.filter((c) => c.id !== id));
  };

  const updateCorte = (id: number | string, field: keyof CortesNuevos, value: string | number) => {
    setCortes((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
  };

  useEffect(() => {
    if (cortesFiltrados.length > 0) {
      setCortes(cortesFiltrados.map(c => ({
        id: c.id,
        nombre: c.nombre,
        kg: c.kgTotal,
        precio_por_kg: c.precioPorKg,
      })))
    } else {
      setCortes([{ id: nextId++, nombre: "Asado", kg: 0, precio_por_kg: 0 }]);
    };
  }, [cortesFiltrados]);

  const handleIniciarDesposte = (data: ResData) => {
    setResActual(data);
    setDialogOpen(false);
    refetchReses();
  };

  const progresoColor =
    progresoAsignado > 100 ? "error" : progresoAsignado > 85 ? "success" : "primary";

  const BoxTitutloUltimaRes = ({ isMobile = false }) => (
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
        Última res cargada
      </Typography>
    </Stack>
  );

  const TextoDeDespotada = ({ isMobile = false }) => {
    return resYaDespostada && (
      <Stack sx={{
        display: isMobile ? { xs: "flex", md: "none" } : { xs: "none", md: "flex" },
        m: 0,
        textAlign: 'center'
      }}
      >
        <Typography variant="body2" fontWeight={600} sx={{ fontSize: '1rem', mt: { xs: 1.5, sm: 0, md: 0 } }}>
          Esta res ya fue despostada
        </Typography>
      </Stack>
    );
  }

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
            <ContentCutRoundedIcon fontSize='small' sx={{ mr: 1 }} />Desposte
          </Typography>
          <Typography variant="body2">
            Desposta y asigna
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon fontSize="small" />}
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
          Agregar Nueva res
        </Button>
      </Box>
      <Box mt={3} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="overline" fontWeight={600}>
            Historial de reses compradas
          </Typography>
        </Box>
        <Box sx={{ display: { xs: 'none', sm: 'none', md: 'block' } }}>
          <Typography variant="overline" fontWeight={600}>
            Última res cargada
          </Typography>
        </Box>
      </Box>
      <Stack flexDirection={{ xs: 'column', sm: 'column', md: 'column', lg: 'column', xl: 'row' }} gap={2} sx={{ mb: 2.2, width: '100%' }}>
        <Paper variant="outlined" sx={{ borderRadius: 3, boxShadow: 4, width: { xs: '100%', sm: '100%', md: '100%' }, fontSize: '1rem', overflow: 'hidden', backgroundColor: "#1c1c1c", border: 'none' }}>
          <TableContainer sx={{ maxHeight: 320, minHeight: 100 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow sx={{ bgcolor: "black" }}>
                  <TableCell sx={{ fontWeight: 600, bgcolor: "#1c1c1c" }} align="center">Proveedor</TableCell>
                  <TableCell sx={{ fontWeight: 600, bgcolor: "#1c1c1c" }} align="center">Fecha de compra</TableCell>
                  <TableCell sx={{ fontWeight: 600, bgcolor: "#1c1c1c" }} align="center">Peso total</TableCell>
                  <TableCell sx={{ fontWeight: 600, bgcolor: "#1c1c1c" }} align="center">Precio por kg</TableCell>
                  <TableCell sx={{ fontWeight: 600, bgcolor: "#1c1c1c" }} align="center">Costo total</TableCell>
                  <TableCell sx={{ fontWeight: 600, bgcolor: "#1c1c1c" }} align="center">Estado</TableCell>
                  <TableCell sx={{ fontWeight: 600, bgcolor: "#1c1c1c" }} align="center">Cargar res</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loadingReses ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ border: 'none' }}>
                      <CircularProgress
                        size={50}
                        sx={{
                          color: "#ffffff",
                          marginTop: "60px",
                          marginLeft: '225px'
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ) : reses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ border: 'none' }}>
                      <Typography variant="body2" fontWeight={500} sx={{ marginLeft: { xs: '100px', sm: '100px', md: '320px' }, fontSize: '1rem' }}>
                        Todavía no tenés reses cargadas. Carga una para verla aquí.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  reses.map((r) => {
                    const totalCorte = r.peso_total * r.precio_kg;
                    return (
                      <TableRow key={r.id} hover>
                        <TableCell align="center" sx={{ border: 'none' }}>
                          <Typography>{r.proveedor}</Typography>
                        </TableCell>
                        <TableCell align="center" sx={{ border: 'none' }}>
                          <Typography>{formatearFecha(r.fecha_compra)}</Typography>
                        </TableCell>
                        <TableCell align="center" sx={{ border: 'none' }}>
                          <Typography>{r.peso_total} Kg</Typography>
                        </TableCell>
                        <TableCell align="center" sx={{ border: 'none' }}>
                          <Typography>{formatPesos(r.precio_kg)}</Typography>
                        </TableCell>
                        <TableCell align="center" sx={{ border: 'none' }}>
                          <Typography>{formatPesos(totalCorte)}</Typography>
                        </TableCell>
                        <TableCell align="center" sx={{ border: 'none' }}>
                          <Typography>{r.despostada === true ? 'Despostada' : 'No despostada'}</Typography>
                        </TableCell>
                        <TableCell align="center" sx={{ border: 'none' }}>
                          <Button
                            size="small"
                            variant="contained"
                            onClick={() => handleCargarRes(r)}
                            sx={{ borderRadius: 3, textTransform: 'none', fontSize: '1rem' }}
                          >
                            Cargar
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
        <BoxTitutloUltimaRes isMobile={true} />
        <Box display="flex" gap={1} flexWrap="wrap">
          <Stack flexDirection={'row'} gap={1} flexWrap='wrap' sx={{ width: '100%', minWidth: 200 }}>
            <Paper variant="outlined" sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', boxShadow: 4, borderRadius: 3, border: 'none', backgroundColor: "#1c1c1c", minWidth: 200, p: 2 }}>
              <Typography variant="body2" fontWeight={600} sx={{ mb: 1, display: 'flex', alignItems: 'center' }}><LocalShippingRoundedIcon sx={{ mr: 1 }} /> Proveedor</Typography>
              <Typography sx={{ fontSize: { xs: '1.2rem' } }}>{resActual?.proveedor || '-/-'}</Typography>
            </Paper>
            <Paper variant="outlined" sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', boxShadow: 4, borderRadius: 3, border: 'none', backgroundColor: "#1c1c1c", minWidth: 202, p: 1 }}>
              <Typography variant="body2" fontWeight={600} sx={{ mb: 1, display: 'flex', alignItems: 'center' }}><ScaleIcon sx={{ mr: 1 }} /> Peso total</Typography>
              <Typography variant="h6">{resActual?.pesoKg || '-/-'} Kg</Typography>
            </Paper>
            <Paper variant="outlined" sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', boxShadow: 4, borderRadius: 3, border: 'none', backgroundColor: "#1c1c1c", minWidth: 170, p: 2 }}>
              <Typography variant="body2" fontWeight={600} sx={{ mb: 1, display: 'flex', alignItems: 'center' }}><PaymentsRoundedIcon sx={{ mr: 1 }} /> Precio/Kg</Typography>
              <Typography variant="h6">
                {resActual ? formatPesos(resActual?.precioPorKg) : '-/-'}
              </Typography>
            </Paper>
          </Stack>
          <Stack flexDirection={'row'} gap={1} sx={{ width: '100%' }}>
            <Paper variant="outlined" sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', boxShadow: 4, borderRadius: 3, border: 'none', backgroundColor: "#1c1c1c", p: 2 }}>
              <Typography variant="body2" fontWeight={600} sx={{ mb: 1, display: 'flex', alignItems: 'center' }}><ReceiptLongRoundedIcon sx={{ mr: 1 }} /> Costo total</Typography>
              <Typography variant="h6" color="warning.main">{formatPesos(costoTotal) || '-/-'}</Typography>
            </Paper>
            <Paper variant="outlined" sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', boxShadow: 4, borderRadius: 3, border: 'none', backgroundColor: "#1c1c1c", p: 2 }}>
              <Typography variant="body2" fontWeight={600} sx={{ mb: 1, display: 'flex', alignItems: 'center' }}><EventRoundedIcon sx={{ mr: 1 }} /> Fecha compra</Typography>
              <Typography variant="h6">{formatearFecha(resActual?.fecha || '-/-')}</Typography>
            </Paper>
          </Stack>
        </Box>
      </Stack>
      <Box mt={2}>
        <Typography variant="overline" fontWeight={600}>
          Seguimiento de la merma obtenida
        </Typography>
      </Box>
      <Paper variant="outlined" sx={{ borderRadius: 3, mb: 2, backgroundColor: 'transparent', border: 'none' }}>
        <Stack flexDirection={'row'} gap={1} flexWrap='wrap' sx={{ width: '100%', minWidth: 200, mb: 1.8 }}>
          <Paper variant="outlined" sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', borderRadius: 3, border: 'none', backgroundColor: "#1c1c1c", boxShadow: 4 }}>
            <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>Kilos asignados</Typography>
            {loadingCortes ? (
              <CircularProgress
                size={20}
                sx={{
                  color: "#ffffff",
                  marginTop: "1px",
                  marginRight: '5px'
                }}
              />
            ) : (
              <Typography
                variant="body2"
                fontWeight={500}
                color={totalKgAsignados >= pesoTotal ? "success.main" : "text.primary"}
                sx={{ fontSize: '1rem' }}
              >
                {totalKgAsignados >= pesoTotal ? (
                  "¡Todo asignado!"
                ) : (
                  `${totalKgAsignados.toFixed(1)} kg`
                )}
              </Typography>
            )}
          </Paper>
          <Paper variant="outlined" sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', borderRadius: 3, border: 'none', backgroundColor: "#1c1c1c", boxShadow: 4, p: 2 }}>
            <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>Merma estimada</Typography>
            {loadingCortes ? (
              <CircularProgress
                size={22}
                sx={{
                  color: "#ffffff",
                  marginTop: "1px",
                  marginRight: '5px'
                }}
              />
            ) : (
              <Typography
                variant="body2"
                fontWeight={500}
                color={totalKgAsignados >= pesoTotal ? "success.main" : "text.primary"}
                sx={{ fontSize: '1rem' }}
              >
                {totalKgAsignados >= pesoTotal ? (
                  "¡Todo asignado!"
                ) : (
                  <Typography variant="body2" fontWeight={500} color="warning.main" sx={{ fontSize: '1.2rem' }}>
                    {mermaKg.toFixed(1)} kg
                  </Typography>
                )}
              </Typography>
            )}
          </Paper>
        </Stack>
        <Box mb={0.5}>
          <Box display="flex" justifyContent="space-between" mb={0.5}>
            <Typography variant="body2">
              Kilos asignados sobre el total
            </Typography>
            {loadingCortes ? (
              <CircularProgress
                size={15}
                sx={{
                  color: "#ffffff",
                  marginRight: '5px'
                }}
              />
            ) : (
              <Typography variant="caption">
                {progresoAsignado.toFixed(0)}%
              </Typography>
            )}
          </Box>
          <LinearProgress
            variant="determinate"
            value={Math.min(progresoAsignado, 100)}
            color={progresoColor}
            sx={{ height: 8, borderRadius: 4 }}
          />
        </Box>
      </Paper>
      <Box mt={2}>
        <Typography variant="overline" fontWeight={600}>
          Cortes obtenidos
        </Typography>
      </Box>
      <Paper variant="outlined" sx={{ borderRadius: 3, border: 'none', backgroundColor: "#1c1c1c", boxShadow: 4, width: { xs: '100%', sm: '100%', md: '100%' }, fontSize: '1rem', overflow: 'hidden', mb: 2 }}>
        <TableContainer sx={{ maxHeight: 420, minHeight: 100 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow sx={{ bgcolor: "black" }}>
                <TableCell sx={{ fontWeight: 600, backgroundColor: "#1c1c1c" }}>Nombre del corte</TableCell>
                <TableCell sx={{ fontWeight: 600, backgroundColor: "#1c1c1c" }}>Kg obtenidos</TableCell>
                <TableCell sx={{ fontWeight: 600, backgroundColor: "#1c1c1c" }}>Precio venta ($/kg)</TableCell>
                <TableCell sx={{ fontWeight: 600, backgroundColor: "#1c1c1c" }}>Ingreso</TableCell>
                <TableCell sx={{ fontWeight: 600, backgroundColor: "#1c1c1c" }}></TableCell>
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
                        marginLeft: '15px'
                      }}
                    />
                  </TableCell>
                </TableRow>
              ) : (
                cortes.map((corte) => {
                  const ingreso = (corte.kg || 0) * (corte.precio_por_kg || 0);
                  const esPorDebajoCosto = corte.precio_por_kg > 0 && corte.precio_por_kg < costoRealPorKg;
                  return (
                    <TableRow key={corte.id} hover>
                      <TableCell sx={{ border: 'none' }}>
                        <TextField
                          value={corte.nombre}
                          disabled={resYaDespostada}
                          onChange={(e) => updateCorte(corte.id, "nombre", e.target.value)}
                          placeholder="Nombre del corte"
                          size="small"
                          variant="standard"
                          fullWidth
                          slotProps={{ input: { disableUnderline: false } }}
                        />
                      </TableCell>
                      <TableCell sx={{ border: 'none' }}>
                        <TextField
                          type="number"
                          value={corte.kg || ""}
                          disabled={resYaDespostada}
                          onChange={(e) => updateCorte(corte.id, "kg", parseFloat(e.target.value) || 0)}
                          size="small"
                          variant="standard"
                          sx={{ width: 80 }}
                          slotProps={{
                            input: {
                              disableUnderline: false,
                              endAdornment: <InputAdornment position="end">Kg</InputAdornment>,
                            },
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ border: 'none' }}>
                        <TextField
                          type="number"
                          value={corte.precio_por_kg || ""}
                          disabled={resYaDespostada}
                          onChange={(e) =>
                            updateCorte(corte.id, "precio_por_kg", parseFloat(e.target.value) || 0)
                          }
                          size="small"
                          variant="standard"
                          sx={{ width: 100 }}
                          error={esPorDebajoCosto}
                          slotProps={{
                            input: {
                              disableUnderline: false,
                              startAdornment: <InputAdornment position="start">$</InputAdornment>,
                            },
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ border: 'none' }}>
                        <Typography
                          variant="body2"
                          fontWeight={500}
                          color={ingreso > 0 ? "success.main" : "text.disabled"}
                          sx={{ fontSize: '1rem' }}
                        >
                          {ingreso > 0 ? formatPesos(ingreso) : "—"}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ border: 'none' }}>
                        <IconButton
                          size="small"
                          onClick={() => removeCorte(corte.id)}
                          color="default"
                          disabled={cortes.length === 1 || resYaDespostada}
                        >
                          <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Divider />
        <Box p={2}>
          <Typography variant="body2" display="block" mb={1.5}>
            Cortes frecuentes
          </Typography>
          <Box display="flex" flexWrap="wrap" gap={1}>
            {CORTES_SUGERIDOS.filter(
              (s) => !cortes.find((c) => c.nombre.toLowerCase() === s.toLowerCase())
            ).map((s) => (
              <Chip
                key={s}
                label={s}
                size="small"
                disabled={resYaDespostada || Math.round(totalKgAsignados * 100) >= Math.round(pesoTotal * 100) || loadingDesposte}
                onClick={() => addCorte(s)}
                icon={<AddIcon />}
                variant="outlined"
                sx={{ cursor: "pointer" }}
              />
            ))}
          </Box>
          <Button
            startIcon={<AddIcon />}
            disabled={resYaDespostada || Math.round(totalKgAsignados * 100) >= Math.round(pesoTotal * 100) || loadingDesposte}
            onClick={() => addCorte()}
            sx={{ mt: 2, textTransform: 'none', fontSize: '0.90rem', borderRadius: 3, backgroundColor: '#ef44441b' }}
          >
            Agregar corte personalizado
          </Button>
        </Box>
      </Paper>

      {
        costoRealPorKg > 0 && (
          <Alert severity="info" sx={{ mb: 2, borderRadius: 3, boxShadow: 4, fontSize: '1rem' }}>
            El costo real por kg de esta res es <strong>{formatPesos(costoRealPorKg)}/Kg</strong>.
            Los cortes con precio de venta por debajo de este valor generan pérdida.
          </Alert>
        )
      }

      <Paper variant="outlined" sx={{ p: 2.2, borderRadius: 3, mb: { xs: 3.5, sm: 3, md: 0 }, boxShadow: 4, backgroundColor: "#1c1c1c", border: 'none' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Box>
            <Typography variant="body2" fontWeight={600}>Ingreso potencial total</Typography>
            {loadingCortes ? (
              <CircularProgress
                size={35}
                sx={{ color: "#ffffff", marginLeft: '55px', marginTop: '10px' }}
              />
            ) : (
              <>
                <Typography variant="h5" fontWeight={700} color={ingresoTotal >= costoTotal ? "success.main" : "error.main"}>
                  {ingresoTotal > 0 ? formatPesos(ingresoTotal) : "—"}
                </Typography>
                {ingresoTotal > 0 && (
                  <Typography variant="caption" fontWeight={600}>
                    {ingresoTotal >= costoTotal
                      ? `Ganancia potencial: ${formatPesos(ingresoTotal - costoTotal)}`
                      : `Pérdida potencial: ${formatPesos(ingresoTotal - costoTotal)}`}
                  </Typography>
                )}
              </>
            )}
          </Box>
          <TextoDeDespotada isMobile={false} />
          <Button
            variant="contained"
            size="large"
            disabled={
              loadingDesposte || 
              cortes.length === 0 || 
              resYaDespostada || 
              Math.round(totalKgAsignados * 100) !== Math.round(pesoTotal * 100)  
            }
            onClick={() => handleGuardar(cortes)}
            startIcon={<CheckCircleOutlineIcon />}
            sx={{ borderRadius: 2, fontWeight: 600, textTransform: 'none' }}
          >
            {loadingDesposte ? (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CircularProgress
                  size={20}
                  sx={{
                    color: "#ffffff",
                    marginRight: "10px"
                  }}
                />
                <span>Guardando...</span>
              </Box>
            ) : 'Guardar'}
          </Button>
        </Box>
        <TextoDeDespotada isMobile={true} />
      </Paper>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        PaperProps={{ sx: { borderRadius: 3, backgroundColor: '#141414', border: 'none' } }}
        fullWidth
        maxWidth="sm"
      >
        <DialogContent sx={{ p: 0, border: 'none' }}>
          <NuevaRes onIniciarDesposte={handleIniciarDesposte} onCancelar={() => setDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </Box >
  );
};

export default Desposte;
