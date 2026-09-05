import { useState } from "react";
import { filtrarCortesService } from "../dashboard.service";
import { useSnackbar } from "../../../context/SnackbarContext";
import type { Corte } from "../types";

export const useFiltrarCortes = () => {
    const [cortesFiltrados, setCortesFiltrados] = useState<Corte[]>([]);
    const limpiarCortes = () => setCortesFiltrados([]);
    const [loadingCortes, setLoadingCortes] = useState(false);
    const { showSnackbar } = useSnackbar();

    const filtrarCortes = async (res_id: string) => {
        setLoadingCortes(true);

        const resultado = await filtrarCortesService(res_id);

        if (!resultado.success) {
            showSnackbar(resultado.message, 'error');
            setLoadingCortes(false);
            return false;
        }

        setCortesFiltrados(resultado.datosCortesFiltrados.data);
        setLoadingCortes(false);
    };

    return { cortesFiltrados, filtrarCortes, limpiarCortes, loadingCortes };
};