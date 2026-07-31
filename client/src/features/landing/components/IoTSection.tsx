'use client';

import { motion } from 'framer-motion';
import { Radio, Wifi, Bluetooth, Satellite, Signal, EthernetPort, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Button from '@/components/ui/Button';

const protocols = [
  { icon: Wifi, label: 'WiFi', value: '2.4/5 GHz', status: 'active' },
  { icon: Bluetooth, label: 'BLE', value: '5.0 + Mesh', status: 'active' },
  { icon: Signal, label: 'Zigbee', value: '3.0 / Pro', status: 'active' },
  { icon: Satellite, label: 'LoRaWAN', value: 'Long Range', status: 'active' },
  { icon: EthernetPort, label: 'Ethernet', value: '10/100 Mbps', status: 'active' },
  { icon: Radio, label: 'NB-IoT', value: 'Cellular', status: 'coming' },
];

const devices = [
  { name: 'ESP32-S3', type: 'Microcontroller', temp: '45°C', load: '34%' },
  { name: 'Raspberry Pi 5', type: 'Single Board', temp: '52°C', load: '67%' },
  { name: 'Arduino R4', type: 'Development Board', temp: '38°C', load: '22%' },
  { name: 'Sensors Hub', type: 'Gateway', temp: '41°C', load: '55%' },
];

export default function IoTSection() {
  return (
    <section className="py-24 relative bg-bg-secondary/30">
      <div className="absolute inset-0 section-grid opacity-20" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-sm text-xs font-bold text-accent mb-5 border border-accent/10 tracking-wide uppercase">
            <Radio size={12} /> IoT Connectivity
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-text-primary mb-4 tracking-tight">
            Multi-Protocol{' '}<span className="gradient-text">Connectivity</span>
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto text-base font-semibold">
            Seamlessly connect any device, any protocol, any cloud. Our platform speaks every IoT language.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="dashboard-card p-6"
          >
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-success animate-status-blink" />
                <h3 className="text-sm font-bold text-text-primary uppercase tracking-wide">Supported Protocols</h3>
              </div>
              <span className="text-xs font-bold text-text-muted">6 protocols</span>
            </div>
            <div className="space-y-3">
              {protocols.map((p) => (
                <div key={p.label} className="flex items-center justify-between p-3 rounded-xl bg-bg-surface border border-border-default">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-accent/20 to-blue-500/10 flex items-center justify-center">
                      <p.icon className="w-4 h-4 text-accent" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-text-primary">{p.label}</div>
                      <div className="text-xs font-semibold text-text-muted">{p.value}</div>
                    </div>
                  </div>
                  {p.status === 'active' ? (
                    <span className="h-2 w-2 rounded-full bg-success animate-status-blink" />
                  ) : (
                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Soon</span>
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="dashboard-card p-6"
          >
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-success animate-status-blink" />
                <h3 className="text-sm font-bold text-text-primary uppercase tracking-wide">Live Devices</h3>
              </div>
              <span className="text-xs font-bold text-success">{devices.length} online</span>
            </div>
            <div className="space-y-3">
              {devices.map((d) => (
                <div key={d.name} className="flex items-center justify-between p-3 rounded-xl bg-bg-surface border border-border-default">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-emerald-500/20 to-teal-500/10 flex items-center justify-center shrink-0">
                      <Radio className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-text-primary truncate">{d.name}</div>
                      <div className="text-xs font-semibold text-text-muted">{d.type}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 ml-3">
                    <div className="text-right">
                      <div className="text-xs font-bold text-text-secondary tabular-nums">{d.temp}</div>
                      <div className="text-[10px] font-semibold text-text-muted">Temp</div>
                    </div>
                    <div className="w-12">
                      <div className="h-1.5 bg-bg-surface rounded-full overflow-hidden">
                        <div className="h-full bg-accent rounded-full" style={{ width: d.load }} />
                      </div>
                      <div className="text-[10px] font-bold text-text-muted text-right mt-0.5">{d.load}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-border-default">
              <Link href="/explore">
                <Button variant="ghost" size="sm" className="w-full justify-between">
                  View Device Dashboard <ArrowRight size={13} />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
