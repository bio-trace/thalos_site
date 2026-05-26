'use client';
import { motion, useReducedMotion } from 'framer-motion';

type Ring = {
  value: number;
  max: number;
  radius: number;
  strokeWidth: number;
  opacity?: number;
};

const RINGS: Ring[] = [
  { value: 87, max: 100, radius: 150, strokeWidth: 10 },
  { value: 91, max: 100, radius: 118, strokeWidth: 8, opacity: 0.75 },
  { value: 64, max: 100, radius: 86, strokeWidth: 6, opacity: 0.5 },
];

type Satellite = {
  label: string;
  value: string;
  x: number;
  y: number;
};

const SATELLITES: Satellite[] = [
  { label: 'HR', value: '56 bpm', x: -160, y: -120 },
  { label: 'HRV', value: '78 ms', x: 160, y: -120 },
  { label: 'Lactate', value: '2.1 mmol/L', x: -160, y: 120 },
  { label: 'Sleep', value: '7h 52m', x: 160, y: 120 },
];

const SIZE = 380;
const CENTER = SIZE / 2;

export function ScienceViz() {
  const reduced = useReducedMotion();

  return (
    <div
      className="relative"
      style={{ width: SIZE, height: SIZE }}
      aria-hidden="true"
    >
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, rgba(0,224,255,0.18), transparent 60%)',
          filter: 'blur(8px)',
        }}
      />

      <svg
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="relative"
      >
        <defs>
          <radialGradient id="sv-grid-fade" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(68,108,143,0.25)" />
            <stop offset="100%" stopColor="rgba(68,108,143,0)" />
          </radialGradient>
        </defs>

        <circle
          cx={CENTER}
          cy={CENTER}
          r={CENTER - 4}
          fill="none"
          stroke="url(#sv-grid-fade)"
          strokeWidth="1"
          strokeDasharray="2 6"
        />
        <line x1={CENTER} y1={20} x2={CENTER} y2={SIZE - 20} stroke="rgba(68,108,143,0.12)" strokeWidth="1" />
        <line x1={20} y1={CENTER} x2={SIZE - 20} y2={CENTER} stroke="rgba(68,108,143,0.12)" strokeWidth="1" />

        {RINGS.map((r, i) => {
          const circumference = 2 * Math.PI * r.radius;
          const offset = circumference - (r.value / r.max) * circumference;
          return (
            <g key={i} transform={`rotate(-90 ${CENTER} ${CENTER})`}>
              <circle
                cx={CENTER}
                cy={CENTER}
                r={r.radius}
                fill="none"
                stroke="rgba(68,108,143,0.3)"
                strokeWidth={r.strokeWidth}
              />
              <motion.circle
                cx={CENTER}
                cy={CENTER}
                r={r.radius}
                fill="none"
                stroke="#00E0FF"
                strokeOpacity={r.opacity ?? 1}
                strokeWidth={r.strokeWidth}
                strokeLinecap="round"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: reduced ? offset : circumference }}
                whileInView={{ strokeDashoffset: offset }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{
                  duration: reduced ? 0 : 1.0,
                  delay: reduced ? 0 : 0.1 + i * 0.15,
                  ease: 'easeOut',
                }}
                style={{
                  filter: `drop-shadow(0 0 ${10 - i * 2}px rgba(0,224,255,${0.6 - i * 0.15}))`,
                }}
              />
            </g>
          );
        })}
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-eyebrow uppercase tracking-eyebrow text-cyan">Recovery</span>
        <span className="text-white font-bold text-[64px] leading-none mt-1">87</span>
        <span className="text-steel text-caption mt-2">Sleep 91 · Strain 64</span>
      </div>

      {SATELLITES.map((s) => (
        <div
          key={s.label}
          className="absolute flex flex-col items-center text-center min-w-[88px]"
          style={{
            left: CENTER + s.x,
            top: CENTER + s.y,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <span className="text-[10px] uppercase tracking-wider text-steel">{s.label}</span>
          <span className="text-white text-caption font-semibold mt-0.5">{s.value}</span>
        </div>
      ))}
    </div>
  );
}
