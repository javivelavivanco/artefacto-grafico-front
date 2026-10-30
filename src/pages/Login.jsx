import { useState } from 'react';
import logoAgIcono from '@/assets/logo_ag_ico.svg';
import estilos from '@/pages/Login.module.css';
import useSesion from '@/hooks/useSesion';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, cargando, error } = useSesion();

  const handleIniciarSesion = async (evento) => {
    evento.preventDefault();
    await login(email, password);
  };

  return (
    <main className={estilos.paginaAcceso}>
      <section className={estilos.panelAcceso} aria-label="Acceso de personal">
        <header className={estilos.encabezadoAcceso}>
          <img className={estilos.iconoMarca} src={logoAgIcono} alt="" aria-hidden="true" />
          <h1>Artefacto Gráfico</h1>
        </header>
        <div className={estilos.formularioAcceso}>
          <h2>Iniciar sesión</h2>
          <p className={estilos.introduccion}>Accede a tu departamento y gestiona todos los pedidos.</p>
          {error && <p className={estilos.mensajeError} role="alert">{error}</p>}
          <form onSubmit={handleIniciarSesion}>
            <label htmlFor="email">Correo electrónico<input id="email" type="email" autoComplete="username" value={email} onChange={(evento) => setEmail(evento.target.value)} placeholder="departamento@ag.com" required /></label>
            <label htmlFor="password">Contraseña<input id="password" type="password" autoComplete="current-password" value={password} onChange={(evento) => setPassword(evento.target.value)} required /></label>
            <button type="submit" disabled={cargando}>
              {cargando ? 'Validando acceso…' : 'Entrar'}
              <img src="https://img.icons8.com/?size=48&id=fgncQVuvyOZp&format=png&color=FFFFFF" alt="" aria-hidden="true" />
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
