import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { API_URL, solicitarApi as realizarSolicitudApi } from '@/services/api-client';

const FORMULARIO_VACIO = {
  cliente: '', tipo: '', fechaEntrega: '', prioridad: '',
  cantidad: '', ancho: '', alto: '',
  soporte: '', gramaje: '', tecnicaImpresion: '', tintas: '',
  acabados: [], troquelado: false, numeroTroquel: '',
  manipuladoEspecial: false, observaciones: ''
};
const FILTROS_VACIOS = {
  texto: '', estado: '', prioridad: '', tecnicaImpresion: '', soporte: '',
  gramaje: '', tintas: '', acabado: ''
};
function crearFormularioVacio(opciones) {
  const valores = opciones?.valoresPorDefecto || {};
  return {
    ...FORMULARIO_VACIO,
    prioridad: valores.prioridad || '',
    tecnicaImpresion: valores.tecnicaImpresion || '',
    tintas: valores.tintas || '',
    manipuladoEspecial: valores.manipuladoEspecial === true
  };
}

function prepararFormularioEdicion(orden, opciones) {
  const especificacion = orden.especificaciones || {};
  const cliente = orden.cliente || {};
  const valores = opciones?.valoresPorDefecto || {};
  return {
    ...FORMULARIO_VACIO,
    cliente: cliente.nombre || '',
    tipo: orden.tipo || '',
    fechaEntrega: orden.fechaEntrega?.slice(0, 10) || '',
    prioridad: orden.prioridad || valores.prioridad || '',
    cantidad: String(orden.cantidad ?? ''),
    ancho: String(especificacion.ancho ?? ''),
    alto: String(especificacion.alto ?? ''),
    soporte: especificacion.soporte || '',
    gramaje: String(especificacion.gramaje ?? ''),
    tecnicaImpresion: orden.tecnicaImpresion || '',
    tintas: especificacion.tintas || valores.tintas || '',
    acabados: especificacion.acabados || [],
    troquelado: Boolean(especificacion.troquelado),
    numeroTroquel: especificacion.numeroTroquel || '',
    manipuladoEspecial: Boolean(especificacion.manipuladoEspecial),
    observaciones: orden.observaciones || ''
  };
}

function coincideEstado(orden, filtroEstado, opciones) {
  if (!filtroEstado) return true;
  if (filtroEstado === opciones?.estadoFiltroIncidencia) return Boolean(orden.incidencia?.activa);
  return orden.estado === filtroEstado;
}

function coincideConFiltros(orden, filtros, vistaMetrica, opciones) {
  const especificacion = orden.especificaciones || {};
  const estadosEnFabricacion = opciones?.estadosEnFabricacion || [];

  return (vistaMetrica !== 'fabricacion' || estadosEnFabricacion.includes(orden.estado))
    && (vistaMetrica !== 'incidencias' || orden.incidencia?.activa)
    && (vistaMetrica !== 'finalizados' || orden.estado === opciones?.estadoFinalizado)
    && coincideEstado(orden, filtros.estado, opciones)
    && (!filtros.prioridad || orden.prioridad === filtros.prioridad)
    && (!filtros.tecnicaImpresion || orden.tecnicaImpresion === filtros.tecnicaImpresion)
    && (!filtros.soporte || especificacion.soporte === filtros.soporte)
    && (!filtros.gramaje || String(especificacion.gramaje) === filtros.gramaje)
    && (!filtros.tintas || especificacion.tintas === filtros.tintas)
    && (!filtros.acabado || especificacion.acabados?.includes(filtros.acabado));
}

// Los números secuenciales identifican el orden de recepción; la cola muestra primero el más reciente.
function compararNumeroOrden(ordenA, ordenB) {
  const numeroA = Number(String(ordenA.numeroOrden ?? '').replace(/\D/g, ''));
  const numeroB = Number(String(ordenB.numeroOrden ?? '').replace(/\D/g, ''));
  return numeroB - numeroA;
}

export default function useOrdenes({ usuario, token, puedeGestionarProduccion, alCaducarSesion }) {
  const [ordenes, setOrdenes] = useState([]);
  const [opciones, setOpciones] = useState(null);
  const [errorOpciones, setErrorOpciones] = useState('');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [formulario, setFormulario] = useState(() => crearFormularioVacio());
  const [ordenEditada, setOrdenEditada] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [filtros, setFiltros] = useState(FILTROS_VACIOS);
  const [vistaMetrica, setVistaMetrica] = useState('');
  const identificadorCargaActual = useRef(0);

  const solicitarApi = useCallback((url, opciones = {}) => realizarSolicitudApi(url, {
    ...opciones,
    token,
    alNoAutorizado: alCaducarSesion
  }), [alCaducarSesion, token]);

  useEffect(() => {
    if (!usuario?.nombre || !token) return undefined;
    let vigente = true;
    solicitarApi(`${API_URL}/api/ordenes/opciones`)
      .then((catalogo) => {
        if (!vigente) return;
        setOpciones(catalogo);
        setErrorOpciones('');
        setFormulario((actual) => !actual.tecnicaImpresion && !actual.prioridad ? crearFormularioVacio(catalogo) : actual);
      })
      .catch((fallo) => {
        if (vigente) setErrorOpciones(fallo.message);
      });
    return () => { vigente = false; };
  }, [solicitarApi, token, usuario?.nombre]);

  const obtenerOrdenesProduccion = useCallback(async (terminoBusqueda = filtros.texto) => {
    const identificadorCarga = ++identificadorCargaActual.current;
    setCargando(true);
    try {
      const parametros = new URLSearchParams();
      if (terminoBusqueda.trim()) parametros.set('busqueda', terminoBusqueda.trim());
      const consulta = parametros.toString();
      const resultado = await solicitarApi(`${API_URL}/api/ordenes${consulta ? `?${consulta}` : ''}`);
      if (identificadorCarga === identificadorCargaActual.current) {
        setOrdenes(resultado);
        setError('');
      }
    } catch (fallo) {
      if (identificadorCarga === identificadorCargaActual.current) setError(fallo.message);
    } finally {
      if (identificadorCarga === identificadorCargaActual.current) setCargando(false);
    }
  }, [filtros.texto, solicitarApi]);

  useEffect(() => {
    if (!usuario?.nombre || !token) return undefined;
    const temporizador = window.setTimeout(() => obtenerOrdenesProduccion(), filtros.texto.trim() ? 250 : 0);
    return () => window.clearTimeout(temporizador);
  }, [filtros.texto, obtenerOrdenesProduccion, token, usuario?.nombre]);

  const ordenesFiltradas = useMemo(() => ordenes
    .filter((orden) => coincideConFiltros(orden, filtros, vistaMetrica, opciones))
    .sort(compararNumeroOrden), [ordenes, filtros, vistaMetrica, opciones]);

  const metricas = useMemo(() => ({
    pedidos: ordenes.length,
    fabricacion: ordenes.filter((orden) => opciones?.estadosEnFabricacion?.includes(orden.estado)).length,
    incidencias: ordenes.filter((orden) => orden.incidencia?.activa).length,
    finalizados: ordenes.filter((orden) => orden.estado === opciones?.estadoFinalizado).length
  }), [ordenes, opciones]);

  const actualizarFormulario = (nuevoFormulario) => setFormulario(nuevoFormulario);

  const alternarAcabado = (acabado) => {
    setFormulario((actual) => ({
      ...actual,
      acabados: actual.acabados.includes(acabado)
        ? actual.acabados.filter((seleccionado) => seleccionado !== acabado)
        : [...actual.acabados, acabado]
    }));
  };

  const abrirNuevaOrden = () => {
    if (!puedeGestionarProduccion || !opciones) return;
    setOrdenEditada(null);
    setFormulario(crearFormularioVacio(opciones));
    setError('');
    setModalAbierto(true);
  };

  const abrirEdicionOrden = (orden) => {
    if (!puedeGestionarProduccion || !opciones) return;
    setOrdenEditada(orden);
    setFormulario(prepararFormularioEdicion(orden, opciones));
    setError('');
    setModalAbierto(true);
  };

  const cerrarFichaOrden = () => {
    setModalAbierto(false);
    setOrdenEditada(null);
  };

  const handleGuardarOrden = async (evento) => {
    evento.preventDefault();
    if (!puedeGestionarProduccion) return;
    setError('');
    if (!opciones) return;
    if (Boolean(formulario.ancho) !== Boolean(formulario.alto)) {
      setError('Indica tanto el ancho como el alto.');
      return;
    }

    const especificaciones = {
      soporte: formulario.soporte.trim(),
      gramaje: formulario.gramaje.trim(),
      tintas: formulario.tintas.trim(),
      acabados: formulario.acabados,
      troquelado: formulario.troquelado,
      numeroTroquel: formulario.troquelado ? formulario.numeroTroquel.trim() : '',
      manipuladoEspecial: formulario.manipuladoEspecial === true,
    };
    if (formulario.ancho && formulario.alto) {
      especificaciones.ancho = Number(formulario.ancho);
      especificaciones.alto = Number(formulario.alto);
    }

    const payload = {
      cliente: { nombre: formulario.cliente.trim() },
      tipo: formulario.tipo,
      cantidad: Number(formulario.cantidad),
      tecnicaImpresion: formulario.tecnicaImpresion,
      fechaEntrega: formulario.fechaEntrega,
      prioridad: formulario.prioridad,
      responsable: ordenEditada?.responsable?._id || ordenEditada?.responsable || usuario.id,
      observaciones: formulario.observaciones.trim(),
      especificaciones
    };

    try {
      await solicitarApi(`${API_URL}/api/ordenes${ordenEditada ? `/${ordenEditada._id}` : ''}`, {
        method: ordenEditada ? 'PUT' : 'POST',
        body: JSON.stringify(payload)
      });
      cerrarFichaOrden();
      await obtenerOrdenesProduccion();
    } catch (fallo) {
      setError(fallo.message);
    }
  };

  const handleCambiarEstado = async (orden, nuevoEstado) => {
    if (!puedeGestionarProduccion) return false;
    if (nuevoEstado === orden.estado) return false;
    setError('');
    try {
      const ordenActualizada = await solicitarApi(`${API_URL}/api/ordenes/${orden._id}/estado`, {
        method: 'PATCH',
        body: JSON.stringify({ nuevoEstado })
      });
      setOrdenes((actuales) => actuales.map((item) => item._id === orden._id ? ordenActualizada : item));
      return true;
    } catch (fallo) {
      setError(fallo.message);
      return false;
    }
  };

  const handleCambiarPrioridad = async (orden, nuevaPrioridad) => {
    if (!puedeGestionarProduccion) return false;
    if (nuevaPrioridad === orden.prioridad) return false;
    setError('');
    try {
      const ordenActualizada = await solicitarApi(`${API_URL}/api/ordenes/${orden._id}/prioridad`, {
        method: 'PATCH',
        body: JSON.stringify({ prioridad: nuevaPrioridad })
      });
      setOrdenes((actuales) => actuales.map((item) => item._id === orden._id ? ordenActualizada : item));
      return true;
    } catch (fallo) {
      setError(fallo.message);
      return false;
    }
  };

  const handleAlternarIncidencia = async (orden) => {
    const activa = !orden.incidencia?.activa;
    setError('');
    try {
      const ordenActualizada = await solicitarApi(`${API_URL}/api/ordenes/${orden._id}/incidencia`, {
        method: 'PATCH',
        body: JSON.stringify({ activa })
      });
      setOrdenes((actuales) => actuales.map((item) => item._id === orden._id ? ordenActualizada : item));
    } catch (fallo) { setError(fallo.message); }
  };

  const handleEliminarOrden = async (id) => {
    if (!puedeGestionarProduccion) return;
    if (!window.confirm('¿Confirmas que quieres eliminar esta orden?')) return;
    setError('');
    try {
      await solicitarApi(`${API_URL}/api/ordenes/${id}`, { method: 'DELETE' });
      setOrdenes((actuales) => actuales.filter((orden) => orden._id !== id));
    } catch (fallo) {
      setError(fallo.message);
    }
  };

  const seleccionarMetrica = (clave) => {
    setFiltros(FILTROS_VACIOS);
    setVistaMetrica(clave === 'pedidos' ? '' : clave);
  };

  const limpiarFiltros = () => {
    setFiltros(FILTROS_VACIOS);
    setVistaMetrica('');
  };

  return {
    ordenes,
    ordenesFiltradas,
    opciones,
    metricas,
    cargando,
    error: error || errorOpciones,
    formulario,
    ordenEditada,
    modalAbierto,
    filtros,
    setFiltros,
    seleccionarMetrica,
    limpiarFiltros,
    actualizarFormulario,
    alternarAcabado,
    abrirNuevaOrden,
    abrirEdicionOrden,
    cerrarFichaOrden,
    handleGuardarOrden,
    handleCambiarEstado,
    handleCambiarPrioridad,
    handleAlternarIncidencia,
    handleEliminarOrden
  };
}
