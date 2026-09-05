import { useState } from "react";
import { guardarDesposteService } from "../dashboard.service";
import { useSnackbar } from "../../../context/SnackbarContext";
import type { CortesNuevos } from "../types";

export const useGuardarDesposte = () => {
    const [loadingDesposte, setLoadingDesposte] = useState(false)
    const { showSnackbar } = useSnackbar();

    const guardarDesposte = async (res_id: string, cortes: CortesNuevos[]) => {
        setLoadingDesposte(true);

        const resultado = await guardarDesposteService(res_id, cortes)

        if (!resultado.success) {
            showSnackbar(resultado.message, 'error');
            setLoadingDesposte(false);
            return false;
        }

        setLoadingDesposte(false);
        showSnackbar(resultado.message, 'success');
        return true;
    }

    return { guardarDesposte, loadingDesposte }
};