import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CabeceraAplicacion from '@/components/CabeceraAplicacion';
import FiltrosTecnicos from '@/components/FiltrosTecnicos';
import FichaOrden from '@/components/FichaOrden';
import PanelMetricas from '@/components/PanelMetricas';
import TablaOrdenes from '@/components/TablaOrdenes';
import useSesion from '@/hooks/useSesion';
import useOrdenes from '@/hooks/useOrdenes';
import estilos from '@/pages/PanelControl.module.css';

export default function PanelControl() {
  const navigate = useNavigate();
  const {
    usuario,
    token,
    puedeGestionarProduccion,
    logout
  } = useSesion();
  const {
    ordenes,
    ordenesFiltradas,
    opciones,
    metricas,
    cargando,
    error,
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
  } = useOrdenes({ usuario, token, puedeGestionarProduccion, alCaducarSesion: logout });

  // La interfaz oculta acciones no permitidas, y la API vuelve a validar el rol al recibirlas.
  useEffect(() => {
    if (!usuario?.nombre || !token) navigate('/', { replace: true });
  }, [navigate, token, usuario?.nombre]);

  return (
    <main className={estilos.panelControl} data-fondo-panel>
      <CabeceraAplicacion usuario={usuario} onCerrarSesion={logout} />

      <section className={estilos.encabezadoPagina}>
        <h1>Panel de producción</h1>
        {puedeGestionarProduccion && (<button className={estilos.botonPrimario} type="button" onClick={abrirNuevaOrden} disabled={!opciones}><span className={estilos.iconoCrearOrden} aria-hidden="true"><img className={estilos.iconoCrearOrdenNormal} src="https://img.icons8.com/?size=48&id=V54UD3Kg4Dt5&format=png&color=FFFFFF" alt="" /><img className={estilos.iconoCrearOrdenHover} src="https://img.icons8.com/?size=48&id=lmKz5lnkwyjp&format=png&color=000000" alt="" /></span> Crear orden</button>)}
      </section>

      {error && !modalAbierto && <p className={`${estilos.alertaError} ${estilos.alertaFlotante}`} role="alert">{error}</p>}

      <PanelMetricas metricas={metricas} onSelect={seleccionarMetrica} />

      <section className={estilos.seccionOrdenes} aria-labelledby="listado-titulo">
        <header className={estilos.cabeceraSeccion}>
          <h2 id="listado-titulo">Cola de pedidos</h2>
        </header>
        <FiltrosTecnicos filtros={filtros} opciones={opciones} onChange={setFiltros} onClear={limpiarFiltros} />
        <TablaOrdenes ordenes={ordenesFiltradas} opciones={opciones} cargando={cargando} onAlternarIncidencia={handleAlternarIncidencia} onEditar={abrirEdicionOrden} onEliminar={handleEliminarOrden} onCambiarEstado={handleCambiarEstado} onCambiarPrioridad={handleCambiarPrioridad} puedeCambiarPrioridad={puedeGestionarProduccion} puedeCambiarEstado={puedeGestionarProduccion} puedeEditarEliminar={puedeGestionarProduccion} />
        <footer className={estilos.textoFooter}>Artefacto Gráfico © • 2026 •<a className={estilos.linkFooter} href="https://javivv.com" target="_blank" rel="noopener noreferrer">javivv.com</a></footer>
      </section>

      {modalAbierto && <FichaOrden formulario={formulario} opciones={opciones} editando={Boolean(ordenEditada)} error={error} onChange={actualizarFormulario} onToggleAcabado={alternarAcabado} onSubmit={handleGuardarOrden} onClose={cerrarFichaOrden} />}
    </main>
  );
}
