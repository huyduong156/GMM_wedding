import { useMemo } from 'react'
import type { ISourceOptions } from '@tsparticles/engine'
import Particles, { ParticlesProvider } from '@tsparticles/react'
import { loadSlim } from '@tsparticles/slim'

const loadVerdantParticles = async (engine: Parameters<typeof loadSlim>[0]) => loadSlim(engine)

export function VerdantParticles({ id, dense = false }: { id: string; dense?: boolean }) {
  const options = useMemo<ISourceOptions>(() => ({
    fullScreen: { enable: false },
    fpsLimit: 30,
    detectRetina: true,
    interactivity: {
      events: {
        onHover: { enable: true, mode: 'bubble' },
        resize: { enable: true },
      },
      modes: {
        bubble: { distance: 90, duration: 1.2, opacity: 0.72, size: 4 },
      },
    },
    particles: {
      color: { value: ['#fff6cf', '#d7e5c8', '#f4df9f'] },
      links: { enable: false },
      move: {
        direction: 'top',
        enable: true,
        outModes: { default: 'out' },
        random: true,
        speed: { min: 0.18, max: 0.72 },
        straight: false,
      },
      number: {
        density: { enable: true, height: 820, width: 560 },
        value: dense ? 42 : 24,
      },
      opacity: {
        animation: { enable: true, speed: 0.28, sync: false },
        value: { min: 0.08, max: 0.48 },
      },
      shape: { type: 'circle' },
      size: {
        animation: { enable: true, speed: 0.35, sync: false },
        value: { min: 0.7, max: 2.8 },
      },
    },
    pauseOnBlur: true,
    pauseOnOutsideViewport: true,
  }), [dense])

  return (
    <ParticlesProvider init={loadVerdantParticles}>
      <Particles id={id} className="vp-particles" options={options} />
    </ParticlesProvider>
  )
}
