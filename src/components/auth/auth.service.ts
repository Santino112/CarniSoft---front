import { supabase } from '../../config/supabaseClient';
import { z } from 'zod';

export const loginUsuario = async (email: string, password: string) => {
    try {
        const { data: datosLogin, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            return { success: false, message: error.message };
        }
        return ({ success: true, message: 'Logueado correctamente.', datosLogin });
    } catch (error) {
        return ({ success: false, message: 'Error al loguearse, intentalo de nuevo.' });
    }
};

///////////////////////////////////////////////////////////////////////////

//TODO: Service para el register
export const registerSchema = z.object({
    nombre: z.string()
        .min(3, 'El nombre debe tener al menos 3 caracteres.')
        .max(40, 'El nombre puede tener como máximo 40 caracteres.'),

    email: z.string()
        .email('El correo electrónico no es válido.'),

    password: z.string()
        .min(6, 'La contraseña debe tener al menos 6 caracteres.')
        .max(40, 'La contraseña puede tener como máximo 40 caracteres.')
        .regex(/[A-Z]/, 'Debe tener al menos una mayuscula.')
        .regex(/[0-9]/, 'Debe tener al menos un número.')
});

export const registerUsuario = async (nombre: string, email: string, password: string) => {
    const validacion = registerSchema.safeParse({ nombre, email, password });

    if (!validacion.success) {
        return { success: false, message: validacion.error.issues[0]?.message };
    };

    try {
        const { data: datosUsuario, error } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { nombre } }
        });

        if (error) {
            return { success: false, message: error.message };
        };
        return { success: true, message: 'Registrado correctamente.', datosUsuario };
    } catch (error) {
        return { success: false, message: 'Error al registrar, intentalo de nuevo.' };
    }
};

