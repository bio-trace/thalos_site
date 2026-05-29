import * as React from 'react';
import clsx from 'clsx';
import { RingViz } from './RingViz';

function FrameShell({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={clsx('relative mx-auto w-[280px] h-[580px] rounded-phone bg-navy border border-border-default overflow-hidden shadow-ring-glow', className)}>
      <div className="absolute top-0 left-0 right-0 h-6 flex items-center justify-center text-[10px] text-steel">9:41</div>
      <div className="pt-8 px-4 h-full">{children}</div>
    </div>
  );
}

export function PhoneHome() {
  return (
    <FrameShell>
      <div className="text-eyebrow text-cyan tracking-eyebrow uppercase mb-1">Today Overview</div>
      <div className="flex items-end justify-between">
        <div>
          <div className="text-white text-[36px] font-bold leading-none">1816 <span className="text-body text-steel">kcal</span></div>
          <div className="text-steel text-caption mt-1">94 kcal übrig</div>
        </div>
        <RingViz value={87} max={100} label="" size={84} strokeWidth={8} />
      </div>
      <div className="grid grid-cols-4 gap-2 mt-6">
        {['HR 56', 'Sleep 87', 'Energy 623', 'Steps 7,842'].map((t) => (
          <div key={t} className="rounded-card-sm border border-border-default p-2 text-[10px] text-steel">{t}</div>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-2 mt-4">
        {['Lactate', 'Sleep Mode', 'Supplements'].map((t) => (
          <div key={t} className="rounded-card-sm border border-border-default p-3 text-[11px] text-white">{t}</div>
        ))}
      </div>
    </FrameShell>
  );
}

export function PhoneSleep() {
  return (
    <FrameShell>
      <div className="text-white text-h2 font-bold">Sleep</div>
      <div className="flex justify-center mt-6">
        <RingViz value={87} label="Sleep Score" size={160} strokeWidth={10} />
      </div>
      <div className="text-center text-steel text-caption mt-3">6h 53m of 8h 0m</div>
      <div className="grid grid-cols-2 gap-2 mt-6">
        {[['Bedtime', '00:20'], ['Wake', '07:52'], ['Efficiency', '91%'], ['Awakenings', '16']].map(([k, v]) => (
          <div key={k} className="rounded-card-sm border border-border-default p-3">
            <div className="text-steel text-[10px]">{k}</div>
            <div className="text-white text-body font-semibold">{v}</div>
          </div>
        ))}
      </div>
    </FrameShell>
  );
}

export function PhoneMeals() {
  return (
    <FrameShell>
      <div className="text-white text-h2 font-bold">Mahlzeiten</div>
      <div className="flex justify-center mt-6">
        <RingViz value={1816} max={1910} label="kcal" size={160} strokeWidth={10} />
      </div>
      <div className="grid grid-cols-3 gap-2 mt-6">
        {[['Protein', '63 g'], ['KH', '239 g'], ['Fett', '67 g']].map(([k, v]) => (
          <div key={k} className="rounded-card-sm border border-border-default p-3 text-center">
            <div className="text-steel text-[10px]">{k}</div>
            <div className="text-white text-body font-semibold">{v}</div>
          </div>
        ))}
      </div>
    </FrameShell>
  );
}
