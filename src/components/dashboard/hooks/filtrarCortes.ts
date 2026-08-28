import { useState } from "react";
import { filtrarCortesService } from "../dashboard.service";
import type { Corte } from "../types";

export const useFiltrarCortes = () => {
    const [cortesFiltrados, setCortesFiltrados] = useState<Corte[]>([]);
    const [loadingCortes, setLoadingCortes] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const filtrarCortes = async (res_id: string) => {
        setLoadingCortes(true);
        setError(null);

        const resultado = await filtrarCortesService(res_id);

        if (!resultado.success) {
            setError(resultado.message);
            setLoadingCortes(false);
            return false;
        }

        setCortesFiltrados(resultado.datosCortesFiltrados.data);
        setLoadingCortes(false);
    };

    return { cortesFiltrados, filtrarCortes, loadingCortes, error };
};