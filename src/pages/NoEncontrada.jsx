import { Link } from 'react-router-dom';
import CabeceraAplicacion from '@/components/CabeceraAplicacion';
import estilosPanel from '@/pages/PanelControl.module.css';

export default function NoEncontrada() {
  return (
    <main className={estilosPanel.panelControl} data-fondo-panel>
      <CabeceraAplicacion enlazarMarca={false} />
      <section className={estilosPanel.encabezadoPagina}>
        <div>
          <h1>¡Esta página no existe!</h1>
          <p>No hay nada que hacer por aquí...</p>
          <Link className={`${estilosPanel.botonSesion} ${estilosPanel.enlaceInicio}`} to="/">
          <img src="https://img.icons8.com/?size=24&id=uOoIUTYvxnso&format=png&color=FFFFFF" alt="" aria-hidden="true" />
            <span>Iniciar sesión</span>
          </Link>
        </div>
      </section>
      <footer className={estilosPanel.textoFooter}>Artefacto Gráfico © • 2026 •<a className={estilosPanel.linkFooter} href="https://javivv.com" target="_blank" rel="noopener noreferrer">javivv.com</a></footer>
    </main>
  );
}