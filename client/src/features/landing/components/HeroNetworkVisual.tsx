'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Bot, Gauge, Shield, Signal } from 'lucide-react';

const networkNodes = [
  { id: 'core', x: 260, y: 240, label: 'AI CORE', type: 'hub', r: 22 },
  { id: 'edge', x: 140, y: 120, label: 'EDGE GW', type: 'edge', r: 14 },
  { id: 'sensor1', x: 60, y: 260, label: 'TEMP', type: 'sensor', r: 9 },
  { id: 'sensor2', x: 440, y: 180, label: 'VIBRATION', type: 'sensor', r: 9 },
  { id: 'sensor3', x: 380, y: 360, label: 'PRESSURE', type: 'sensor', r: 9 },
  { id: 'cloud', x: 460, y: 340, label: 'CLOUD', type: 'cloud', r: 16 },
  { id: 'sensor4', x: 180, y: 380, label: 'FLOW', type: 'sensor', r: 9 },
];

const connections: [number, number][] = [
  [0, 1], [0, 2], [0, 3], [0, 4], [0, 6],
  [1, 2], [1, 6], [3, 5], [4, 5],
];

function FloatingWidget({ children, className, delay = 0, duration = 5 }: { children: React.ReactNode; className: string; delay?: number; duration?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`absolute ${className}`}
    >
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration, repeat: Infinity, ease: 'easeInOut' }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

// Animated network diagram with floating status widgets, shown on large
// screens next to the hero copy.
export default function HeroNetworkVisual() {
  const [activePulse, setActivePulse] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActivePulse((prev) => (prev + 1) % connections.length);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="hidden lg:block relative h-[600px]"
    >
      <svg viewBox="0 0 520 480" className="w-full h-full" fill="none">
        <defs>
          <radialGradient id="hub-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="sensor-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="flow-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0" />
            <stop offset="40%" stopColor="#60a5fa" stopOpacity="1" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </linearGradient>
          <filter id="glow"><feGaussianBlur stdDeviation="3" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        </defs>

        {connections.map(([from, to], i) => {
          const n1 = networkNodes[from];
          const n2 = networkNodes[to];
          return (
            <g key={`conn-${i}`}>
              <line x1={n1.x} y1={n1.y} x2={n2.x} y2={n2.y}
                stroke="#d0dae0" strokeWidth="1.2" strokeLinecap="round" />
              {activePulse === i && (
                <motion.circle
                  r="3.5" fill="#3b82f6" filter="url(#glow)"
                  initial={{ cx: n1.x, cy: n1.y, opacity: 0 }}
                  animate={{
                    cx: [n1.x, (n1.x + n2.x) / 2, n2.x],
                    cy: [n1.y, (n1.y + n2.y) / 2, n2.y],
                    opacity: [0, 1, 0],
                  }}
                  transition={{ duration: 2.2, ease: 'easeInOut', repeat: Infinity, repeatDelay: 2 }}
                />
              )}
            </g>
          );
        })}

        {networkNodes.map((node, i) => (
          <g key={node.id}>
            {node.type === 'hub' && (
              <motion.circle
                cx={node.x} cy={node.y} r="50"
                fill="url(#hub-glow)"
                animate={{ r: [50, 58, 50], opacity: [0.35, 0.55, 0.35] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              />
            )}
            <motion.circle
              cx={node.x} cy={node.y}
              r={node.r || 10}
              fill={node.type === 'hub' ? '#3b82f6' : node.type === 'cloud' ? '#8b5cf6' : node.type === 'edge' ? '#f59e0b' : '#10b981'}
              stroke={node.type === 'hub' ? '#93c5fd' : `${node.type === 'cloud' ? '#c4b5fd' : node.type === 'edge' ? '#fde68a' : '#a7f3d0'}`}
              strokeWidth="2"
              className={node.type === 'hub' ? '' : 'animate-pulse-soft'}
            />
            {node.type === 'hub' && (
              <motion.circle
                cx={node.x} cy={node.y} r="6" fill="white"
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              />
            )}
            {node.type === 'sensor' && (
              <motion.circle
                cx={node.x} cy={node.y} r="12"
                fill="url(#sensor-glow)"
                animate={{ r: [12, 16, 12], opacity: [0.25, 0.4, 0.25] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
              />
            )}
            <text x={node.x} y={node.y + node.r + 14}
              textAnchor="middle" fill="#556c82" fontSize="9" fontFamily="JetBrains Mono, monospace" letterSpacing="1.5">
              {node.label}
            </text>
          </g>
        ))}
      </svg>

      <FloatingWidget className="-top-2 right-8" delay={0.5}>
        <div className="dashboard-card p-3.5 pr-5 flex items-center gap-3 shadow-elevation-medium">
          <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
            <Signal size={15} className="text-emerald-500" />
          </div>
          <div>
            <div className="text-xs font-semibold text-text-primary tabular-nums">1,247</div>
            <div className="text-[10px] text-text-tertiary">Live Signals</div>
          </div>
        </div>
      </FloatingWidget>

      <FloatingWidget className="top-32 -right-4" delay={0.7}>
        <div className="dashboard-card p-3.5 pr-5 flex items-center gap-3 shadow-elevation-medium">
          <div className="h-8 w-8 rounded-lg bg-violet-500/10 flex items-center justify-center">
            <Bot size={15} className="text-violet-500" />
          </div>
          <div>
            <div className="text-xs font-semibold text-text-primary tabular-nums">AI Active</div>
            <div className="text-[10px] text-text-tertiary">Monitoring</div>
          </div>
        </div>
      </FloatingWidget>

      <FloatingWidget className="bottom-12 -left-2" delay={0.6}>
        <div className="dashboard-card p-3.5 pr-5 flex items-center gap-3 shadow-elevation-medium">
          <div className="h-8 w-8 rounded-lg bg-accent/10 flex items-center justify-center">
            <Gauge size={15} className="text-accent" />
          </div>
          <div>
            <div className="text-xs font-semibold text-text-primary tabular-nums">99.97%</div>
            <div className="text-[10px] text-text-tertiary">System Health</div>
          </div>
        </div>
      </FloatingWidget>

      <FloatingWidget className="bottom-36 -right-6" delay={0.8}>
        <div className="dashboard-card p-3.5 pr-5 flex items-center gap-3 shadow-elevation-medium">
          <div className="h-8 w-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
            <Shield size={15} className="text-amber-500" />
          </div>
          <div>
            <div className="text-xs font-semibold text-text-primary tabular-nums">End-to-End</div>
            <div className="text-[10px] text-text-tertiary">Encrypted</div>
          </div>
        </div>
      </FloatingWidget>

      <FloatingWidget className="top-1/3 left-6" delay={0.9}>
        <div className="dashboard-card p-2.5 flex items-center gap-2 shadow-elevation-medium">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse-soft" />
          <span className="text-[10px] font-semibold text-text-primary">24 Online</span>
        </div>
      </FloatingWidget>
    </motion.div>
  );
}
