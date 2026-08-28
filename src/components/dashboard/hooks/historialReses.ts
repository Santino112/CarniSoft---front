import { useState, useEffect } from "react";
import { historialResesService } from "../dashboard.service";
import type { ResHistorial } from "../types";

export const useHistorialReses = () => {
    const [reses, setReses] = useState<ResHistorial[]>([]);
    const [loadingReses, setLoadingReses] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const historialResesUsuario = async () => {
        setLoadingReses(true)
        setError(null)

        const resultado = await historialResesService();

        if (!resultado.success) {
            setError(resultado.message);
            setLoadingReses(false)
            return false
        }

        setReses(resultado.datosHistorialReses.data);
        setLoadingReses(false);
    };

    useEffect(() => {
        historialResesUsuario();
    }, []);

    return { reses, loadingReses, error };
};

