import { useState } from "react";
import { nuevaResService } from "../dashboard.service";
import { useSnackbar } from "../../../context/SnackbarContext";
import { useAuth } from "../../auth/context/UseAuth";
import type { ResData } from "../types";

export const useNuevaRes = (onIniciarDesposte?: (data: ResData) => void) => {
    const [loadingGuardarRes, setLoadingGuardarRes] = useState(false);
    const { user } = useAuth();
    const { showSnackbar } = useSnackbar();

    const guardarNuevaRes = async (
        proveedor: string,
        fechaCompra: string,
        peso: number,
        precio: number
    ) => {

        if (!user) {
            return { success: false, message: 'No hay sesión activa.' }
        };

        setLoadingGuardarRes(true);
        console.log('user:', user)
        const resultado = await nuevaResService(proveedor, fechaCompra, peso, precio, user.id);

        if (!resultado.success) {
            showSnackbar(resultado.message, 'error');
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
        showSnackbar(resultado.message, 'success');
        return { success: true, message: resultado.message };
    };

    return { guardarNuevaRes, loadingGuardarRes };
};