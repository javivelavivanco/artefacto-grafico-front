import estilos from '@/pages/PanelControl.module.css';

export default function FiltrosTecnicos({ filtros, opciones, onChange, onClear }) {
  const catalogo = opciones || {};
  // El texto libre se consulta en la API; los selectores técnicos filtran la lista ya cargada.
  const actualizarFiltro = (evento) => onChange({ ...filtros, [evento.target.name]: evento.target.value });

  return (
    <section className={estilos.filtrosPanel} aria-label="Filtros técnicos de producción">
      <div className={estilos.busquedaPrincipal}>
        <label className={estilos.campoBusqueda} htmlFor="filtro-texto">
          <span className={estilos.visualmenteOculto}>Buscar órdenes</span>
          <span aria-hidden="true" className={estilos.iconoLupa}>⌕</span>
          <input id="filtro-texto" name="texto" value={filtros.texto} onChange={actualizarFiltro} placeholder="Busca por cliente o nº de orden" />
        </label>
        <label className={estilos.filtroEstado} htmlFor="filtro-estado">
          <span>Estado del pedido</span>
          <select id="filtro-estado" name="estado" value={filtros.estado} onChange={actualizarFiltro}>
            <option value="">Todos los estados</option>
            {catalogo.estadosFiltro?.map(({ valor, etiqueta }) => <option value={valor} key={valor}>{etiqueta}</option>)}
          </select>
        </label>
        <button className={estilos.botonTexto} type="button" onClick={onClear}>Limpiar filtros</button>
      </div>

      <details className={estilos.filtrosAvanzados}>
        <summary>Más filtros</summary>
        <div className={estilos.rejillaFiltros}>
          <label htmlFor="filtro-tecnica">Técnica<select id="filtro-tecnica" name="tecnicaImpresion" value={filtros.tecnicaImpresion} onChange={actualizarFiltro}>
            <option value="">Todas</option>
            {catalogo.tecnicasImpresion?.map((tecnica) => <option value={tecnica} key={tecnica}>{tecnica}</option>)}
          </select></label>
          <label htmlFor="filtro-soporte">Soporte / Material<select id="filtro-soporte" name="soporte" value={filtros.soporte} onChange={actualizarFiltro}>
            <option value="">Todos</option>
            {catalogo.soportes?.map((soporte) => <option value={soporte} key={soporte}>{soporte}</option>)}
          </select></label>
          <label htmlFor="filtro-gramaje">Gramaje<select id="filtro-gramaje" name="gramaje" value={filtros.gramaje} onChange={actualizarFiltro}>
            <option value="">Todos</option>
            {catalogo.gramajes?.map((gramaje) => <option value={gramaje} key={gramaje}>{gramaje}</option>)}
          </select></label>
          <label htmlFor="filtro-tintas">Tintas<select id="filtro-tintas" name="tintas" value={filtros.tintas} onChange={actualizarFiltro}>
            <option value="">Todas</option>
            {catalogo.tintas?.map((tinta) => <option value={tinta} key={tinta}>{tinta}</option>)}
          </select></label>
          <label htmlFor="filtro-acabado">Acabado<select id="filtro-acabado" name="acabado" value={filtros.acabado} onChange={actualizarFiltro}>
            <option value="">Todos</option>
            {catalogo.acabados?.map((acabado) => <option value={acabado} key={acabado}>{acabado}</option>)}
          </select></label>
          <label htmlFor="filtro-prioridad">Prioridad<select id="filtro-prioridad" name="prioridad" value={filtros.prioridad} onChange={actualizarFiltro}>
            <option value="">Todas</option>
            {catalogo.prioridades?.map((prioridad) => <option value={prioridad} key={prioridad}>{prioridad}</option>)}
          </select></label>
        </div>
      </details>
    </section>
  );
}
