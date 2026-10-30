import logoAg from '@/assets/logo_ag.svg';
import estilos from '@/pages/PanelControl.module.css';
import { NOMBRES_ROLES } from '@/utils/roles';
import { Link } from 'react-router-dom';

export default function CabeceraAplicacion({ usuario, onCerrarSesion, enlazarMarca = true }) {
  // La página 404 desactiva la navegación de la marca para no ofrecer una ruta protegida.
  const contenidoMarca = <img className={estilos.logoMarca} src={logoAg} alt="" />;

  return (
    <header className={estilos.cabeceraAplicacion}>
      {enlazarMarca
        ? <Link to="/panel-control" className={estilos.marca} aria-label="Artefacto Gráfico, inicio">{contenidoMarca}</Link>
        : <span className={estilos.marca} aria-hidden="true">{contenidoMarca}</span>}
      {usuario && <div className={estilos.navegacionCabecera}>
        <div className={estilos.usuarioCabecera}><span><strong>{usuario.nombre}</strong><small>{NOMBRES_ROLES[usuario.rol] || usuario.rol}</small></span></div>
        <button className={estilos.botonSesion} type="button" onClick={onCerrarSesion}>
          <span>Cerrar sesión</span>
          <img src="https://img.icons8.com/?size=24&id=Q1xkcFuVON39&format=png&color=FFFFFF" alt="" aria-hidden="true" />
        </button>
      </div>}
    </header>
  );
}
