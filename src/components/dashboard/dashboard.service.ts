import axios from 'axios';
import { api } from '../../api/httpClient';
import type { CortesNuevos } from './types';

//TODO: Servicios de la sección de DESPOSTE de la página. 
export const nuevaResService = async (proveedor: string, fechaCompra: string, pesoTotal: number, precioKg: number) => {
    try {
        const { data: datosConsulta } = await api.post('/api/desposte/registrarRes', {
            proveedor,
            fechaCompra,
            pesoTotal,
            precioKg
        });
        return ({ success: true, message: 'Res registrada con éxito', datosConsulta });
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return { success: false, message: error.response?.data?.error ?? 'Error al registrar la res, intentalo de nuevo.' };
        };
        return { success: false, message: 'Error al registrar la res, intentalo de nuevo.' };
    }
};

export const guardarDesposteService = async (res_id: string, cortes: CortesNuevos[]) => {
    try {
        const { data: datosDesposte } = await api.post('/api/desposte/guardarDesposte', {
            res_id,
            cortes: cortes.map(c => ({
                nombre: c.nombre,
                kg: c.kg,
                precio_por_kg: c.precio_por_kg
            }))
        });
        return ({ success: true, message: 'Desposte guardado con éxito', datosDesposte })
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return { success: false, message: error.response?.data?.error ?? 'Error al guardar el desposte, intentalo de nuevo.' };
        };
        return { success: false, message: 'Error al guardar el desposte, intentalo de nuevo.' };
    }
};
//TODO:///////////////////////////////////////////////////////////////////////////////////////

//TODO: Servicios de la sección de SEGUIMIENTO de la página.
export const historialResesService = async () => {
    try {
        const { data: datosHistorialReses } = await api.post('/api/seguimiento/historialReses');
        return ({ success: true, message: 'Historial obtenido con éxito', datosHistorialReses })
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return { success: false, message: error.response?.data?.error ?? 'Error al obtener el historial de reses, intentolo de nuevo.' };
        };
        return { success: false, message: 'Error al obtener el historial de reses, intentolo de nuevo.' };
    }
};

export const filtrarCortesService = async (res_id: string) => {
    try {
        const { data: datosCortesFiltrados } = await api.post('/api/seguimiento/filtrarCortes', { res_id });
        return ({ success: true, message: 'Cortes filtrados con éxito', datosCortesFiltrados });
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return { success: false, message: error.response?.data?.error ?? 'Error al filtrar los cortes, intentolo de nuevo.' };
        };
        return { success: false, message: 'Error al filtrar los cortes, intentolo de nuevo.' };
    }
};

export const registrarVenta = async (corte_id: string,  kg_vendido: number, precio_kg: number, fecha_venta: string) => {
    try {
        const { data: datosVentaRealizada } = await api.post('/api/seguimiento/registrarVenta', { corte_id, kg_vendido, precio_kg, fecha_venta});
        return ({ success: true, message: 'Venta realizada con éxito', datosVentaRealizada});
    } catch (error) {
         if (axios.isAxiosError(error)) {
            return { success: false, message: error.response?.data?.error ?? 'Error al realizar la venta, intentolo de nuevo.' };
        };
        return { success: false, message: 'Error al realizar la venta, intentolo de nuevo.' };
    };
};