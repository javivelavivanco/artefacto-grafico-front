import { createContext, useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL, solicitarApi } from '@/services/api-client';

export const SesionContext = createContext(null);

function leerSesion() {
  try {
    return JSON.parse(localStorage.getItem('usuario') || 'null');
  } catch {
    return null;
  }
}

export const SesionProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(leerSesion);
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const puedeGestionarProduccion = usuario?.rol === 'produccion';

  const login = useCallback(async (email, password) => {
    setError('');
    setCargando(true);

    try {
      // Conserva el token y el usuario que autorizan las solicitudes posteriores al panel.
      const datos = await solicitarApi(`${API_URL}/api/auth/login`, {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      localStorage.setItem('usuario', JSON.stringify(datos.usuario));
      localStorage.setItem('token', datos.token);
      setUsuario(datos.usuario);
      setToken(datos.token);
      navigate('/panel-control');
      return true;
    } catch (fallo) {
      setError(fallo.message);
      return false;
    } finally {
      setCargando(false);
    }
  }, [navigate]);

  const logout = useCallback(() => {
    localStorage.removeItem('usuario');
    localStorage.removeItem('token');
    setUsuario(null);
    setToken(null);
    navigate('/', { replace: true });
  }, [navigate]);

  const value = useMemo(() => ({
    usuario,
    token,
    puedeGestionarProduccion,
    cargando,
    error,
    login,
    logout
  }), [usuario, token, puedeGestionarProduccion, cargando, error, login, logout]);

  return <SesionContext.Provider value={value}>{children}</SesionContext.Provider>;
};
