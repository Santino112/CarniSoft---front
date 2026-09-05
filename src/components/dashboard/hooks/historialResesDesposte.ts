import { useState, useEffect } from "react";
import { historialResesService } from "../dashboard.service";
import { useSnackbar } from "../../../context/SnackbarContext";
import { useAuth } from "../../auth/context/UseAuth";
import type { ResHistorial } from "../types";

export const useHistorialResesDesposte = (soloDespostadas?: boolean) => {
    const [reses, setReses] = useState<ResHistorial[]>([]);
    const { user } = useAuth();
    const [loadingReses, setLoadingReses] = useState(false);
    const { showSnackbar } = useSnackbar();

    const historialResesUsuario = async () => {
        if (!user) return;
        setLoadingReses(true);

        const resultado = await historialResesService(user.id, soloDespostadas);

        if (!resultado.success) {
            showSnackbar(resultado.message, 'error');
            setLoadingReses(false);
            return false;
        }

        setReses(resultado.datosHistorialReses.data);
        setLoadingReses(false);
    };

    useEffect(() => {
        historialResesUsuario();
    }, []);

    return { reses, loadingReses, refetchReses: historialResesUsuario };
};

