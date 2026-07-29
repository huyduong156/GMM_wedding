import type { CSSProperties } from 'react'
import { Balloon, EnvelopeSimple, Feather, FlowerLotus } from '@phosphor-icons/react'

const seeded = (index: number, salt: number) => {
  const value = Math.sin(index * 91.73 + salt * 47.11) * 43758.5453
  return value - Math.floor(value)
}

const petals = Array.from({ length: 10 }, (_, index) => ({
  id: index,
  style: {
    '--petal-x': `${2 + seeded(index, 1) * 96}%`,
    '--petal-size': `${5 + seeded(index, 2) * 5}px`,
    '--petal-duration': `${14 + seeded(index, 3) * 11}s`,
    '--petal-delay': `${-seeded(index, 4) * 23}s`,
    '--petal-opacity': 0.3 + seeded(index, 5) * 0.42,
    '--petal-sway-a': `${-72 + seeded(index, 6) * 144}px`,
    '--petal-sway-b': `${-96 + seeded(index, 7) * 192}px`,
    '--petal-drift': `${-130 + seeded(index, 8) * 260}px`,
    '--petal-tilt': `${-80 + seeded(index, 9) * 160}deg`,
    '--petal-rot-a': `${-190 + seeded(index, 10) * 380}deg`,
    '--petal-rot-b': `${-330 + seeded(index, 11) * 660}deg`,
    '--petal-rot-end': `${-620 + seeded(index, 12) * 1240}deg`,
  } as CSSProperties,
}))
const ambientObjects = [
  { id: 'envelope-one', kind: 'envelope', Icon: EnvelopeSimple, size: 34, duration: 34, delay: -8, y: 18 },
  { id: 'feather-one', kind: 'feather', Icon: Feather, size: 29, duration: 27, delay: -19, x: 76 },
  { id: 'balloon-one', kind: 'balloon', Icon: Balloon, size: 30, duration: 38, delay: -25, x: 18 },
  { id: 'dandelion-one', kind: 'dandelion', Icon: FlowerLotus, size: 25, duration: 31, delay: -13, y: 67 },
  { id: 'feather-two', kind: 'feather', Icon: Feather, size: 22, duration: 39, delay: -31, x: 39 },
  { id: 'envelope-two', kind: 'envelope', Icon: EnvelopeSimple, size: 25, duration: 43, delay: -29, y: 81 },
  { id: 'balloon-two', kind: 'balloon', Icon: Balloon, size: 22, duration: 46, delay: -7, x: 87 },
]

export function WeddingAmbient() {
  return (
    <div className="wedding-ambient" aria-hidden="true">
      <span className="ambient-glow ambient-glow-one" />
      <span className="ambient-glow ambient-glow-two" />
      <div className="silk-ribbons">
        <i />
        <i />
        <i />
      </div>
      <div className="ambient-object-field">
        {ambientObjects.map(({ id, kind, Icon, size, duration, delay, x, y }) => (
          <span
            className={`ambient-object ambient-${kind}`}
            key={id}
            style={{
              '--object-size': `${size}px`,
              '--object-duration': `${duration}s`,
              '--object-delay': `${delay}s`,
              '--object-x': `${x ?? 0}%`,
              '--object-y': `${y ?? 0}%`,
            } as CSSProperties}
          >
            <Icon size={size} weight="thin" />
          </span>
        ))}
      </div>
      <div className="petal-field">
        {petals.map((petal) => <i key={petal.id} style={petal.style} />)}
      </div>
    </div>
  )
}
