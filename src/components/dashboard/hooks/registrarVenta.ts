import { useState } from "react";
import { registrarVenta } from "../dashboard.service";
import type { Venta } from "../types";

export const useRegistrarVenta = () => {
    const [venta, setVenta] = useState<Venta[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const registrarVentaRealizada = async (corte_id: string, kg_vendido: number, precio_kg: number, fecha_compra: string) => {
        setLoading(true);
        setError(null);

        const resultado = await registrarVenta(corte_id, kg_vendido, precio_kg, fecha_compra);
        console.log(resultado);
        if (!resultado.success) {
            setError(resultado.message);
            setLoading(false)
            return false
        }

        setVenta(resultado.datosVentaRealizada.data);
        console.log(resultado.datosVentaRealizada.data);
        setLoading(false);
    };

    return { venta, registrarVentaRealizada, loading, error };
};
