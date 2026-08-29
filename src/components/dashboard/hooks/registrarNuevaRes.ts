import { useState } from "react";
import { nuevaResService } from "../dashboard.service";
import type { ResData } from "../types";

export const useNuevaRes = (onIniciarDesposte?: (data: ResData) => void) => {
    const [loadingGuardarRes, setLoadingGuardarRes] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const guardarNuevaRes = async (
        proveedor: string,
        fechaCompra: string,
        peso: number,
        precio: number
    ) => {
        setLoadingGuardarRes(true);
        setError(null);

        const resultado = await nuevaResService(proveedor, fechaCompra, peso, precio);

        if (!resultado.success) {
            setError(resultado.message);
            setLoadingGuardarRes(false);
            return { success: false, message: resultado.message };
        }

        onIniciarDesposte?.({
            id: resultado.datosConsulta.data.id,
            proveedor,
            fecha: fechaCompra,
            pesoKg: peso,
            precioPorKg: precio,
        });

        setLoadingGuardarRes(false);
        return { success: true, message: resultado.message };
    };

    return { guardarNuevaRes, loadingGuardarRes, error };
};