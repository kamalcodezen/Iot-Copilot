'use client';

import { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';

const loadingPhrases = [
  'Initializing neural network...',
  'Connecting IoT nodes...',
  'Analyzing data streams...',
  'Calibrating sensors...',
  'Establishing secure link...',
  'Loading AI engine...',
  'Syncing telemetry...',
  'Warming up circuits...',
  'Deploying agents...',
  'Readying dashboard...',
];

const nodes = [
  { cx: 120, cy: 60, label: 'HUB' },
  { cx: 60, cy: 140, label: 'SENSOR' },
  { cx: 180, cy: 140, label: 'CLOUD' },
  { cx: 120, cy: 210, label: 'AI' },
  { cx: 40, cy: 60, label: 'EDGE' },
];

const edges = [
  [0, 1], [0, 2], [0, 3],
  [1, 3], [2, 3],
  [4, 0], [4, 1],
];

interface IoTLoaderProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  className?: string;
}

export default function IoTLoader({ size = 'lg', message, className = '' }: IoTLoaderProps) {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [activeEdge, setActiveEdge] = useState(0);

  useEffect(() => {
    const phraseInterval = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % loadingPhrases.length);
    }, 2500);
    return () => clearInterval(phraseInterval);
  }, []);

  useEffect(() => {
    const edgeInterval = setInterval(() => {
      setActiveEdge((prev) => (prev + 1) % edges.length);
    }, 1800);
    return () => clearInterval(edgeInterval);
  }, []);

  const scale = size === 'sm' ? 0.5 : size === 'md' ? 0.75 : 1;

  return (
    <div className={`flex flex-col items-center justify-center gap-6 ${className}`}>
      <svg width={240 * scale} height={260 * scale} viewBox="0 0 240 260" className="overflow-visible">
        <defs>
          <radialGradient id="node-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="pulse-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0" />
            <stop offset="50%" stopColor="#60a5fa" stopOpacity="1" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </linearGradient>
        </defs>

        <g transform={`scale(${scale})`}>
          {edges.map(([from, to], i) => {
            const n1 = nodes[from];
            const n2 = nodes[to];
            const midX = (n1.cx + n2.cx) / 2;
            const midY = (n1.cy + n2.cy) / 2;
            return (
              <g key={`edge-${from}-${to}`}>
                <line
                  x1={n1.cx} y1={n1.cy} x2={n2.cx} y2={n2.cy}
                  stroke="#e2e5ea" strokeWidth="1" strokeLinecap="round"
                />
                {activeEdge === i && (
                  <motion.circle
                    r="3" fill="#60a5fa"
                    initial={{ cx: n1.cx, cy: n1.cy, opacity: 0 }}
                    animate={{
                      cx: [n1.cx, midX, n2.cx],
                      cy: [n1.cy, midY, n2.cy],
                      opacity: [0, 1, 0],
                    }}
                    transition={{ duration: 1.8, ease: 'easeInOut', repeat: 0 }}
                  />
                )}
              </g>
            );
          })}

          {nodes.map((node, i) => (
            <g key={`node-${i}`}>
              <circle cx={node.cx} cy={node.cy} r="18" fill="white" stroke="#e2e5ea" strokeWidth="1" />
              <circle cx={node.cx} cy={node.cy} r="6" fill="#3b82f6" className="animate-pulse-soft" />
              <text x={node.cx} y={node.cy + 32} textAnchor="middle" fill="#64748b" fontSize="8" fontFamily="monospace" letterSpacing="1">{node.label}</text>
            </g>
          ))}

          <motion.circle
            cx={120} cy={210} r="28"
            fill="url(#node-glow)"
            animate={{ r: [28, 34, 28], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </g>
      </svg>

      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="h-2 w-2 rounded-full bg-accent"
              animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.25, ease: 'easeInOut' }}
            />
          ))}
        </div>
        <motion.p
          key={phraseIndex}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.3 }}
          className="text-sm text-text-tertiary font-mono tracking-wide"
        >
          {message || loadingPhrases[phraseIndex]}
        </motion.p>
      </div>
    </div>
  );
}
