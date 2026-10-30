import estilos from '@/pages/PanelControl.module.css';

const CLASES_ESTADO = {
  Diseño: 'estadoDiseno',
  Preimpresión: 'estadoPreimpresion',
  Impresión: 'estadoImpresion',
  Manipulado: 'estadoManipulado',
  Finalizado: 'estadoFinalizado'
};
export default function BadgeEstado({ estado, estadosEditables = [], estadoFinalizado, estadoPorDefecto, editable = false, orden, bloqueada = false, onChange }) {
  const claseEstado = estilos[CLASES_ESTADO[estado] || 'estadoDiseno'];
  if (editable && estado !== estadoFinalizado) {
    return <select
      className={`${estilos.badgeEstado} ${claseEstado} ${estilos.estadoSelector} ${estilos.selectorPrioridad}`}
      value={estado}
      aria-label={`Estado del trabajo ${orden}`}
      disabled={bloqueada}
      onChange={(evento) => onChange(evento.target.value)}
    >
      {estadosEditables.map((opcion) => <option value={opcion} key={opcion}>{opcion}</option>)}
    </select>;
  }
  return <span className={`${estilos.badgeEstado} ${claseEstado}`}>{estado || estadoPorDefecto || ''}</span>;
}
