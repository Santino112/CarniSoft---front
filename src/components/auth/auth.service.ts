import axios from 'axios';
import { api } from '../../api/httpClient';

export const loginUsuario = async (email: string, password: string) => {
    try{
        const {data: datosLogin } = await api.post('/api/auth/loginUser', {
            email,
            password
        });
        return ({ success: true, message: 'Logueado correctamente.',  datosLogin});
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return ({ success: false, message: error.response?.data?.error ?? 'Error al loguearse, intentalo de nuevo.'});
        };
        return ({ success: false, message: 'Error al loguearse, intentalo de nuevo.'});
    }
};

export const registerUsuario = async (nombre: string, email: string, password: string) => {
    try {
        const { data: datosUsuario } = await api.post('/api/auth/registerUser', {
            nombre,
            email,
            password
        });
        return { success: true, message: 'Registrado correctamente.', datosUsuario};
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return { success: false, message: error.response?.data?.error ?? 'Error al registrar, intentalo de nuevo.'};
        };
        return { success: false, message: 'Error al registrar, intentalo de nuevo.'};
    }
};

