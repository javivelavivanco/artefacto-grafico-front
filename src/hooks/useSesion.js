import { useContext } from 'react';
import { SesionContext } from '../context/SesionContext';

export default function useSesion() {
  const context = useContext(SesionContext);
  if (!context) {
    throw new Error('useSesion debe usarse dentro de un SesionProvider');
  }
  return context;
}
