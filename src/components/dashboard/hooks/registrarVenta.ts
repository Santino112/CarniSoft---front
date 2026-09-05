import { useState } from "react";
import { registrarVenta } from "../dashboard.service";
import { useSnackbar } from "../../../context/SnackbarContext";
import type { Venta } from "../types";

export const useRegistrarVenta = () => {
    const [venta, setVenta] = useState<Venta[]>([]);
    const [loadingVenta, setLoadingVenta] = useState(false);
    const { showSnackbar } = useSnackbar();

    const registrarVentaRealizada = async (corte_id: string, kg_vendido: number, precio_kg: number, fecha_compra: string) => {
        setLoadingVenta(true);

        const resultado = await registrarVenta(corte_id, kg_vendido, precio_kg, fecha_compra);
        if (!resultado.success) {
            showSnackbar(resultado.message, 'error');
            setLoadingVenta(false);
            return false;
        }

        setVenta(resultado.datosVentaRealizada.data);
        setLoadingVenta(false);
        showSnackbar(resultado.message, 'success');
    };
    return { venta, registrarVentaRealizada, loadingVenta };
};
