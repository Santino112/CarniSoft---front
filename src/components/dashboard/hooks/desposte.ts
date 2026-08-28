import { useState } from "react";
import { guardarDesposteService } from "../dashboard.service";
import type { CortesNuevos } from "../types";

export const useGuardarDesposte = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const guardarDesposte = async (res_id: string, cortes: CortesNuevos[]) => {
        setLoading(true)
        setError(null)

        const resultado = await guardarDesposteService(res_id, cortes)

        if (!resultado.success) {
            setError(resultado.message);
            setLoading(false)
            return false
        }

        setLoading(false)
        return true
    }

    return { guardarDesposte, loading, error }
};