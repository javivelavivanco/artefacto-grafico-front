import { useState } from 'react';
import BadgeEstado from '@/components/BadgeEstado';
import estilos from '@/pages/PanelControl.module.css';

function formatearFecha(fecha) {
  if (!fecha) return 'Sin fecha';
  return new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(fecha));
}

export default function TablaOrdenes({ ordenes, opciones, cargando, onEditar, onEliminar, onCambiarEstado, onCambiarPrioridad, onAlternarIncidencia, puedeCambiarPrioridad, puedeCambiarEstado, puedeEditarEliminar }) {
  const [filaAnimadaId, setFilaAnimadaId] = useState(null);
  const actualizarEstado = async (orden, nuevoEstado) => {
    if (await onCambiarEstado(orden, nuevoEstado)) {
      setFilaAnimadaId(orden._id);
      window.setTimeout(() => setFilaAnimadaId((actual) => actual === orden._id ? null : actual), 850);
    }
  };
  const actualizarPrioridad = async (orden, nuevaPrioridad) => {
    if (await onCambiarPrioridad(orden, nuevaPrioridad)) {
      setFilaAnimadaId(orden._id);
      window.setTimeout(() => setFilaAnimadaId((actual) => actual === orden._id ? null : actual), 850);
    }
  };
  if (cargando || !opciones) return <p className={estilos.estadoVacio}>Cargando pedidos…</p>;
  if (!ordenes.length) return <div className={estilos.estadoVacio}><strong>¡No se encuentran pedidos!</strong><span>Actualmente no hay ningún pedido con estos filtros...</span></div>;

  return (
    <section className={estilos.marcoOrdenes} aria-label="Órdenes del taller">
      <div className={estilos.encabezadoOrdenes} aria-hidden="true">
        <span>Pedido</span><span>Especificaciones</span><span>Estado</span><span>Prioridad</span><span>Entrega</span><span>Acciones</span><span>{opciones.estadoFinalizado}</span>
      </div>
      <ul className={estilos.listaOrdenes} aria-label="Órdenes de trabajo">
          {ordenes.map((orden) => {
            const especificacion = orden.especificaciones || {};
            const bloqueada = Boolean(orden.incidencia?.activa);
            const finalizada = orden.estado === opciones?.estadoFinalizado;
            return (
                <li key={orden._id} className={`${estilos.filaOrden} ${bloqueada ? estilos.filaBloqueada : ''} ${finalizada ? estilos.filaFinalizada : ''} ${filaAnimadaId === orden._id ? estilos.filaEstadoActualizado : ''}`}>
                <dl className={estilos.celdaTrabajo}>
                  <dt className={estilos.visualmenteOculto}>Trabajo</dt>
                  <dd><span className={estilos.identificadorOrden}>{orden.numeroOrden}</span><strong>{orden.tipo}</strong><small>{orden.cliente?.nombre}</small></dd>
                </dl>
                <dl className={estilos.celdaFicha}>
                  <dt className={estilos.visualmenteOculto}>Especificaciones</dt>
                  <dd><strong className={estilos.tecnicaFicha}>{orden.tecnicaImpresion}</strong>
                    {especificacion.ancho && especificacion.alto && <span>{especificacion.ancho} × {especificacion.alto} mm</span>}
                    <span>{Number(orden.cantidad ?? 0).toLocaleString('es-ES')} uds. · {especificacion.soporte} {especificacion.gramaje}</span>
                    <small>{especificacion.tintas}{especificacion.troquelado ? ' · Troquelado' : ''}{especificacion.manipuladoEspecial ? ' · Manipulado especial' : ''}{especificacion.acabados?.length ? ` · ${especificacion.acabados.join(', ')}` : ''}</small>
                    {especificacion.troquelado && especificacion.numeroTroquel && <small>N.º de troquel: {especificacion.numeroTroquel}</small>}
                    {orden.observaciones?.trim() && <strong className={estilos.observacionFicha}>{orden.observaciones}</strong>}
                  </dd>
                </dl>
                <dl className={estilos.celdaDato}><dt className={estilos.visualmenteOculto}>Estado</dt><dd>
                  <div className={estilos.controlEstado}>
                    {bloqueada && <span className={estilos.etiquetaBloqueo}>Incidencia activa · bloqueada</span>}
                    <BadgeEstado estado={orden.estado} estadosEditables={opciones?.estadosEditables} estadoFinalizado={opciones?.estadoFinalizado} estadoPorDefecto={opciones?.valoresPorDefecto?.estado} editable={!bloqueada && puedeCambiarEstado} bloqueada={bloqueada} orden={orden.tipo} onChange={(estado) => actualizarEstado(orden, estado)} />
                  </div>
                </dd></dl>
                <dl className={`${estilos.celdaDato} ${estilos.celdaPrioridad}`}><dt className={estilos.visualmenteOculto}>Prioridad</dt><dd>
                  <select
                    className={`${estilos.badgePrioridad} ${estilos.selectorPrioridad} ${estilos[`prioridad${orden.prioridad}`] || estilos.prioridadNormal}`}
                    value={orden.prioridad}
                    aria-label={`Prioridad del trabajo ${orden.tipo}`}
                    disabled={bloqueada || finalizada || !puedeCambiarPrioridad}
                    onChange={(evento) => actualizarPrioridad(orden, evento.target.value)}
                  >
                    {opciones?.prioridades?.map((prioridad) => <option value={prioridad} key={prioridad}>{prioridad}</option>)}
                  </select>
                </dd></dl>
                <dl className={estilos.celdaFecha}><dt className={estilos.visualmenteOculto}>Entrega</dt><dd><strong>{formatearFecha(orden.fechaEntrega)}</strong></dd></dl>
                <div className={estilos.celdaAcciones}>
                  <span className={estilos.visualmenteOculto}>Acciones</span>
                  <button className={`${estilos.botonIncidencia} ${bloqueada ? estilos.botonResolverIncidencia : ''}`} type="button" onClick={() => onAlternarIncidencia(orden)} aria-pressed={bloqueada} disabled={finalizada}>{bloqueada ? 'Resolver incidencia' : 'Incidencia'}</button>
                  {(puedeEditarEliminar && !bloqueada) && <span className={estilos.grupoIconosAccion}>
                    <button className={estilos.botonIcono} type="button" onClick={() => onEditar(orden)} aria-label={`Editar ficha de ${orden.tipo}`} title="Editar ficha" disabled={finalizada}><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L8 18l-4 1 1-4Z" /></svg></button>
                  <button className={`${estilos.botonIcono} ${estilos.botonPeligro}`} type="button" onClick={() => onEliminar(orden._id)} aria-label={`Eliminar orden de ${orden.tipo}`} title="Eliminar orden" disabled={finalizada}>×</button>
                  </span>}
                </div>
                {!bloqueada && <dl className={`${estilos.celdaDato} ${estilos.celdaFinalizado}`}><dt className={estilos.visualmenteOculto}>{opciones.estadoFinalizado}</dt><dd><input className={estilos.checkboxFinalizado} type="checkbox" checked={finalizada} disabled={!puedeCambiarEstado} aria-label={`${finalizada ? 'Desmarcar' : 'Marcar'} ${orden.tipo} como ${opciones.estadoFinalizado}`} onChange={(evento) => actualizarEstado(orden, evento.target.checked ? opciones.estadoFinalizado : opciones.estadoReapertura)} /></dd></dl>}
              </li>
            );
          })}
      </ul>
    </section>
  );
}
