export const API_URL = import.meta.env.VITE_EXPRESS || 'http://localhost:3000';

export async function solicitarApi(url, opciones = {}) {
  const { token, alNoAutorizado, ...opcionesFetch } = opciones;
  const respuesta = await fetch(url, {
    ...opcionesFetch,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...opcionesFetch.headers
    }
  });
  const envoltura = respuesta.status === 204 ? null : await respuesta.json();

  // Centraliza la expiración de sesión y devuelve solo los datos del sobre de la API.
  if (respuesta.status === 401) alNoAutorizado?.();
  if (!respuesta.ok) throw new Error(envoltura?.message || 'No se pudo completar la operación.');

  return envoltura && Object.hasOwn(envoltura, 'data') ? envoltura.data : envoltura;
}
