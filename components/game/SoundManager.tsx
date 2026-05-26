'use client';

import { useEffect } from 'react';
import { audioSystem } from '@/lib/audio';

/**
 * Inicializa el sistema de audio al primer click/touch del usuario.
 * Los navegadores requieren interacción del usuario antes de
 * permitir reproducir audio (política anti-autoplay).
 */
export default function SoundManager() {
  useEffect(() => {
    const handleFirstInteraction = () => {
      audioSystem.init();
    };

    // Escuchar el primer click/touch para inicializar
    window.addEventListener('click', handleFirstInteraction, { once: true });
    window.addEventListener('touchstart', handleFirstInteraction, {
      once: true,
    });
    window.addEventListener('keydown', handleFirstInteraction, { once: true });

    return () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };
  }, []);

  return null;
}