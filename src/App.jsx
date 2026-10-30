import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SesionProvider } from '@/context/SesionContext';

const Login = lazy(() => import('@/pages/Login'));
const PanelControl = lazy(() => import('@/pages/PanelControl'));
const NoEncontrada = lazy(() => import('@/pages/NoEncontrada'));

function App() {
  // Las vistas se descargan al navegar y comparten el contexto de sesión.
  return (
    <BrowserRouter>
      <SesionProvider>
        <Suspense fallback={<p role="status">Cargando…</p>}>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/panel-control" element={<PanelControl />} />
            <Route path="*" element={<NoEncontrada />} />
          </Routes>
        </Suspense>
      </SesionProvider>
    </BrowserRouter>
  );
}

export default App;
