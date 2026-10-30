import estilos from '@/pages/PanelControl.module.css';

// Estas tarjetas corresponden a los mismos grupos usados para filtrar la cola.
const TARJETAS = [
  { clave: 'pedidos', titulo: 'Pedidos', detalle: 'Total de pedidos' },
  { clave: 'fabricacion', titulo: 'En curso', tono: 'metricaFabricacion', detalle: 'Pedidos en curso' },
  { clave: 'incidencias', titulo: 'Incidencias', tono: 'metricaIncidencias', detalle: 'Pedidos bloqueados' },
  { clave: 'finalizados', titulo: 'Finalizados', tono: 'metricaFinalizados', detalle: 'Pedidos terminados' }
];

export default function PanelMetricas({ metricas, onSelect }) {
  return (
    <section className={estilos.panelMetricas} aria-label="Indicadores del taller">
      {TARJETAS.map((tarjeta) => (
        <button className={[estilos.tarjetaMetrica, tarjeta.tono && estilos[tarjeta.tono]].filter(Boolean).join(' ')} key={tarjeta.clave} type="button" onClick={() => onSelect(tarjeta.clave)} aria-label={`${tarjeta.titulo}: mostrar órdenes`}>
          <div>
            <p>{tarjeta.titulo}</p>
            <strong>{metricas[tarjeta.clave]}</strong>
            <small>{tarjeta.detalle}</small>
          </div>
          <span className={estilos.metricaMarca} aria-hidden="true" />
        </button>
      ))}
    </section>
  );
}
