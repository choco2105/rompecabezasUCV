// ============================================
// SISTEMA DE AUDIO CENTRAL
// Maneja música de fondo + efectos de sonido (SFX)
// Persistencia de mute en LocalStorage
// ============================================

import { STORAGE_KEYS, AUDIO_DEFAULTS } from './constants';

// ─── Rutas de los archivos ────────────────────────
export const AUDIO_PATHS = {
  music: '/sounds/music/background-music.mp3',
  sfx: {
    pieceSnap: '/sounds/sfx/piece-snap.mp3',
    tracingDone: '/sounds/sfx/tracing-done.mp3',
    starPop: '/sounds/sfx/star-pop.mp3',
    levelComplete: '/sounds/sfx/level-complete.mp3',
  },
} as const;

export type SfxName = keyof typeof AUDIO_PATHS.sfx;

// ─── Estado del sistema ────────────────────────────
class AudioSystem {
  private musicElement: HTMLAudioElement | null = null;
  private sfxBuffers: Map<SfxName, HTMLAudioElement> = new Map();
  private muted: boolean = false;
  private initialized: boolean = false;
  private listeners: Set<() => void> = new Set();

  /**
   * Inicializa el sistema. Debe llamarse DESPUÉS de la primera
   * interacción del usuario (los navegadores bloquean autoplay).
   */
  init(): void {
    if (this.initialized || typeof window === 'undefined') return;

    // Leer estado mute desde localStorage
    try {
      const savedMute = window.localStorage.getItem(STORAGE_KEYS.audioMuted);
      this.muted = savedMute === 'true';
    } catch {
      this.muted = false;
    }

    // Cargar música de fondo
    this.musicElement = new Audio(AUDIO_PATHS.music);
    this.musicElement.loop = true;
    this.musicElement.volume = AUDIO_DEFAULTS.music;
    this.musicElement.preload = 'auto';

    // Precargar SFX
    (Object.keys(AUDIO_PATHS.sfx) as SfxName[]).forEach((name) => {
      const audio = new Audio(AUDIO_PATHS.sfx[name]);
      audio.volume = AUDIO_DEFAULTS.sfx;
      audio.preload = 'auto';
      this.sfxBuffers.set(name, audio);
    });

    this.initialized = true;

    // Si no está muteado, arrancar música
    if (!this.muted) {
      this.playMusic();
    }
  }

  /**
   * Reproduce la música de fondo con fade-in suave
   */
  playMusic(): void {
    if (!this.musicElement || this.muted) return;
    this.musicElement.volume = 0;
    const promise = this.musicElement.play();
    if (promise !== undefined) {
      promise.catch(() => {
        // El navegador bloqueó autoplay; se reintentará en el próximo click
      });
    }
    // Fade-in suave
    const fadeIn = setInterval(() => {
      if (!this.musicElement) {
        clearInterval(fadeIn);
        return;
      }
      if (this.musicElement.volume < AUDIO_DEFAULTS.music - 0.02) {
        this.musicElement.volume = Math.min(
          this.musicElement.volume + 0.02,
          AUDIO_DEFAULTS.music
        );
      } else {
        this.musicElement.volume = AUDIO_DEFAULTS.music;
        clearInterval(fadeIn);
      }
    }, 100);
  }

  /**
   * Detiene la música con fade-out
   */
  stopMusic(): void {
    if (!this.musicElement) return;
    const target = this.musicElement;
    const fadeOut = setInterval(() => {
      if (target.volume > 0.02) {
        target.volume = Math.max(target.volume - 0.05, 0);
      } else {
        target.pause();
        target.currentTime = 0;
        clearInterval(fadeOut);
      }
    }, 50);
  }

  /**
   * Reproduce un efecto de sonido
   */
  playSfx(name: SfxName): void {
    if (this.muted || !this.initialized) return;
    const audio = this.sfxBuffers.get(name);
    if (!audio) return;

    // Clonar para permitir múltiples disparos simultáneos sin cortarse
    const clone = audio.cloneNode(true) as HTMLAudioElement;
    clone.volume = AUDIO_DEFAULTS.sfx;
    const promise = clone.play();
    if (promise !== undefined) {
      promise.catch(() => {
        // Ignorar errores de autoplay bloqueado en SFX
      });
    }
  }

  /**
   * Alterna el estado de mute (música y SFX)
   */
  toggleMute(): boolean {
    this.muted = !this.muted;

    try {
      window.localStorage.setItem(
        STORAGE_KEYS.audioMuted,
        String(this.muted)
      );
    } catch {
      // Silenciar errores de localStorage
    }

    if (this.muted) {
      this.stopMusic();
    } else {
      this.playMusic();
    }

    // Notificar a componentes suscritos
    this.listeners.forEach((cb) => cb());

    return this.muted;
  }

  isMuted(): boolean {
    return this.muted;
  }

  isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * Suscribir un componente a cambios de mute
   */
  subscribe(callback: () => void): () => void {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }
}

// Instancia única exportada
export const audioSystem = new AudioSystem();