import axios from 'axios';
import { api } from '../../api/httpClient';

export const consulta = async (nombre: string, asunto: string, descripcion: string) => {
    try {
        const { data: datosConsulta } = await api.post('/api/consultas/consultaUsuario', {
            nombre,
            asunto,
            descripcion
        });
        return ({ success: true, message: 'Consulta enviada correctamente', datosConsulta });
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return { success: false, message: error.response?.data?.error ?? 'Error al enviar consulta, intentalo de nuevo.' };
        };
        return { success: false, message: 'Error al enviar consulta, intentalo de nuevo.' };
    }
};