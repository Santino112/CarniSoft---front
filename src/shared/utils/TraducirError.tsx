const ERRORES = {
    "invalid login credentials": "Email o contraseña incorrectos.",
    "missing email or phone": "Debe ingresar un email o contraseña.",
    "email not confirmed": "El email no esta confirmado. Confirmelo.",
    "too many request": "Demasiados intentos, espera unos minutos.",
    "user not found": "No existe una cuenta con ese email asociado.",
    "network request failed": "Error de conexión, revisá tu internet.",
    "invalid phone number": "El número de teléfono no es válido.",
    "token has expired or is invalid": "El código SMS no es válido o venció.",
    "sms sending failed": "No se pudo enviar el código SMS.",
    "null value in column": "Hay campos obligatorios sin completar.",
    "duplicate key value": "Ya existe un perfil para este usuario.",
    "violates foreign key constraint": "Error de referencia, intentá de nuevo.",
    "violates not-null constraint": "Hay campos obligatorios sin completar.",
};

export const traducirError = (mensaje: string) => {
  const mensjeEnMinuscula = String(mensaje || '').toLowerCase();

  if (ERRORES[mensjeEnMinuscula as keyof typeof ERRORES]) return ERRORES[mensjeEnMinuscula as keyof typeof ERRORES];

  const claveEncontrada = Object.keys(ERRORES).find((key) => mensjeEnMinuscula.includes(key));
  if (claveEncontrada) return ERRORES[claveEncontrada as keyof typeof ERRORES];

  return "Ocurrió un error, inténtelo de nuevo.";
};