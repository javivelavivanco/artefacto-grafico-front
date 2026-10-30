import estilos from '@/pages/PanelControl.module.css';

export default function FichaOrden({ formulario, editando, error, opciones, onChange, onToggleAcabado, onSubmit, onClose }) {
  const catalogo = opciones || {};
  const cambiarCampo = (evento) => onChange({ ...formulario, [evento.target.name]: evento.target.value });

  // Mantiene el foco dentro del diálogo para que el formulario se pueda recorrer con teclado.
  const gestionarTeclado = (evento) => {
    if (evento.key === 'Escape') {
      onClose();
      return;
    }
    if (evento.key !== 'Tab') return;

    const controles = evento.currentTarget.querySelectorAll('button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled)');
    const primero = controles[0];
    const ultimo = controles[controles.length - 1];
    if (evento.shiftKey && document.activeElement === primero) {
      evento.preventDefault();
      ultimo?.focus();
    } else if (!evento.shiftKey && document.activeElement === ultimo) {
      evento.preventDefault();
      primero?.focus();
    }
  };

  return (
    <div className={estilos.fondoFicha} role="presentation" onMouseDown={(evento) => { if (evento.target === evento.currentTarget) onClose(); }}>
      <section className={estilos.fichaOrden} role="dialog" aria-modal="true" aria-labelledby="titulo-modal" onKeyDown={gestionarTeclado}>
        <header className={estilos.cabeceraFicha}>
          <div><h2 id="titulo-modal">{editando ? 'Editar orden' : 'Crear orden de producción'}</h2></div>
          <button className={estilos.botonCerrar} type="button" onClick={onClose} aria-label="Cerrar formulario" autoFocus>×</button>
        </header>

        <form className={estilos.formularioOrden} onSubmit={onSubmit}>
          {error && <p className={estilos.alertaError} role="alert">{error}</p>}
          <fieldset className={estilos.grupoFormulario}>
            <legend>Datos del pedido</legend>
            <div className={estilos.rejillaFormulario}>
              <label htmlFor="orden-cliente">Cliente<input id="orden-cliente" name="cliente" value={formulario.cliente} onChange={cambiarCampo} required /></label>
              <label htmlFor="orden-tipo">Tipo<select id="orden-tipo" name="tipo" value={formulario.tipo} onChange={cambiarCampo} required><option value="" disabled>Selecciona el formato</option>{catalogo.tipos?.map((tipo) => <option value={tipo} key={tipo}>{tipo}</option>)}</select></label>
              <label htmlFor="orden-cantidad">Cantidad<input id="orden-cantidad" name="cantidad" type="number" min="1" max="5000000" placeholder="(máx. 5.000.000 uds)" value={formulario.cantidad} onChange={cambiarCampo} required /></label>
              <label htmlFor="orden-entrega">Fecha de entrega<input id="orden-entrega" name="fechaEntrega" type="date" value={formulario.fechaEntrega} onChange={cambiarCampo} required /></label>
              <label htmlFor="orden-prioridad">Prioridad<select id="orden-prioridad" name="prioridad" value={formulario.prioridad} onChange={cambiarCampo} required>{catalogo.prioridades?.map((prioridad) => <option value={prioridad} key={prioridad}>{prioridad}</option>)}</select></label>
            </div>
          </fieldset>

          <fieldset className={estilos.grupoFormulario}>
            <legend>Especificaciones de impresión</legend>
            <div className={estilos.rejillaFormulario}>
              <label htmlFor="orden-tecnica">Técnica<select id="orden-tecnica" name="tecnicaImpresion" value={formulario.tecnicaImpresion} onChange={cambiarCampo} required><option value="" disabled>Selecciona la técnica</option>{catalogo.tecnicasImpresion?.map((tecnica) => <option value={tecnica} key={tecnica}>{tecnica}</option>)}</select></label>
              <label htmlFor="orden-soporte">Soporte / Material<select id="orden-soporte" name="soporte" value={formulario.soporte} onChange={cambiarCampo} required><option value="" disabled>Selecciona el soporte</option>{catalogo.soportes?.map((soporte) => <option value={soporte} key={soporte}>{soporte}</option>)}</select></label>
              <label htmlFor="orden-gramaje">Gramaje<select id="orden-gramaje" name="gramaje" value={formulario.gramaje} onChange={cambiarCampo} required><option value="" disabled>Selecciona el gramaje</option>{catalogo.gramajes?.map((gramaje) => <option value={gramaje} key={gramaje}>{gramaje}</option>)}</select></label>
              <label htmlFor="orden-ancho">Ancho (mm)<input id="orden-ancho" name="ancho" type="number" min="1" step="0.1" value={formulario.ancho} onChange={cambiarCampo} required /></label>
              <label htmlFor="orden-alto">Alto (mm)<input id="orden-alto" name="alto" type="number" min="1" step="0.1" value={formulario.alto} onChange={cambiarCampo} required /></label>
              <label htmlFor="orden-tintas">Tintas<select id="orden-tintas" name="tintas" value={formulario.tintas} onChange={cambiarCampo} required><option value="" disabled>Selecciona el tipo de tinta</option>{catalogo.tintas?.map((tinta) => <option value={tinta} key={tinta}>{tinta}</option>)}</select></label>
            </div>
          </fieldset>

          <fieldset className={estilos.grupoFormulario}>
            <legend>Acabados y observaciones</legend>
            <div className={estilos.listaAcabados}>
              {catalogo.acabados?.map((acabado, indice) => (
                <label className={estilos.opcionAcabado} htmlFor={`acabado-${indice}`} key={acabado}>
                  <input id={`acabado-${indice}`} type="checkbox" checked={formulario.acabados.includes(acabado)} onChange={() => onToggleAcabado(acabado)} />
                  <span>{acabado}</span>
                </label>
              ))}
            </div>
            <div className={estilos.bloqueTroquel}>
              <div className={estilos.opcionTroquel}>
                <label htmlFor="orden-troquelado">Troquelado</label>
                <input id="orden-troquelado" name="troquelado" type="checkbox" checked={formulario.troquelado} onChange={(evento) => onChange({ ...formulario, troquelado: evento.target.checked, numeroTroquel: evento.target.checked ? formulario.numeroTroquel : '' })} />
              </div>
              {formulario.troquelado && <label className={estilos.campoNumeroTroquel} htmlFor="orden-numero-troquel">N.º de troquel<input id="orden-numero-troquel" name="numeroTroquel" type="text" value={formulario.numeroTroquel} onChange={cambiarCampo} required /></label>}
            </div>
            <div className={estilos.rejillaFormulario}>
              <label className={estilos.opcionManipuladoEspecial} htmlFor="orden-manipulado-especial">
                <input id="orden-manipulado-especial" name="manipuladoEspecial" type="checkbox" checked={formulario.manipuladoEspecial} onChange={(evento) => onChange({ ...formulario, manipuladoEspecial: evento.target.checked })} />
                Manipulado especial
              </label>
              <label className={estilos.anchoCompleto} htmlFor="orden-observaciones">Observaciones<textarea id="orden-observaciones" name="observaciones" rows="3" value={formulario.observaciones} onChange={cambiarCampo} /></label>
            </div>
          </fieldset>

          <footer className={estilos.pieFicha}>
            <div><button className={estilos.botonSecundario} type="button" onClick={onClose}>Cancelar</button><button className={estilos.botonPrimario} type="submit">{editando ? 'Guardar cambios' : 'Crear orden'}</button></div>
          </footer>
        </form>
      </section>
    </div>
  );
}
