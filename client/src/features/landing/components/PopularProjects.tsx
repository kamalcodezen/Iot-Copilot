'use client';

import { motion } from 'framer-motion';
import { Cpu, Thermometer, Camera, Car, Wifi, Lightbulb, ArrowRight, GitFork, Star } from 'lucide-react';
import Button from '@/components/ui/Button';

const projects = [
  {
    icon: Thermometer,
    title: 'Smart Thermostat',
    description: 'ESP32-based climate control with ML-powered predictive temperature management.',
    author: 'IoT Team',
    forks: '2.4k',
    stars: '5.8k',
    color: 'from-accent/20 to-blue-500/10',
  },
  {
    icon: Camera,
    title: 'AI Security Cam',
    description: 'Raspberry Pi + YOLO object detection with edge-based real-time alerting.',
    author: 'Vision AI',
    forks: '1.8k',
    stars: '4.2k',
    color: 'from-emerald-500/20 to-teal-500/10',
  },
  {
    icon: Car,
    title: 'Autonomous Rover',
    description: 'Arduino-based 4WD rover with ROS2 integration and computer vision navigation.',
    author: 'RoboLab',
    forks: '3.1k',
    stars: '7.6k',
    color: 'from-violet-500/20 to-purple-500/10',
  },
  {
    icon: Wifi,
    title: 'Mesh Network Hub',
    description: 'ESP-NOW mesh network for large-scale sensor deployment with auto-discovery.',
    author: 'NetSys',
    forks: '1.2k',
    stars: '3.4k',
    color: 'from-orange-500/20 to-amber-500/10',
  },
  {
    icon: Lightbulb,
    title: 'Smart Lighting',
    description: 'WiFi-controlled RGB lighting with music sync, scenes, and voice control.',
    author: 'HomeIoT',
    forks: '4.7k',
    stars: '12.3k',
    color: 'from-cyan-500/20 to-sky-500/10',
  },
  {
    icon: Cpu,
    title: 'Edge AI Gateway',
    description: 'Dual-core gateway processing sensor data with on-device TensorFlow Lite.',
    author: 'EdgeSys',
    forks: '0.9k',
    stars: '2.8k',
    color: 'from-rose-500/20 to-pink-500/10',
  },
];

export default function PopularProjects() {
  return (
    <section className="py-24 relative overflow-hidden" id="popular-projects">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-sm text-xs font-bold text-accent mb-5 border border-accent/10 tracking-wide uppercase">
            <Star size={12} /> Community Projects
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-text-primary mb-4 tracking-tight">
            Popular{' '}<span className="gradient-text">Open-Source Projects</span>
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto text-base font-semibold">
            Explore thousands of community-built IoT projects. Fork, modify, and deploy in minutes.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((project, i) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.4 }}
              className="dashboard-card p-6 hover-lift group cursor-pointer"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`h-11 w-11 rounded-xl bg-gradient-to-br ${project.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <project.icon className="w-5.5 h-5.5 text-accent" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-base font-bold text-text-primary truncate">{project.title}</h3>
                  <div className="text-xs font-semibold text-text-muted">by {project.author}</div>
                </div>
              </div>
              <p className="text-sm text-text-secondary leading-relaxed mb-4 line-clamp-2">{project.description}</p>
              <div className="flex items-center gap-4 pt-4 border-t border-border-default">
                <div className="flex items-center gap-1.5">
                  <GitFork size={13} className="text-text-muted" />
                  <span className="text-xs font-bold text-text-muted tabular-nums">{project.forks}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Star size={13} className="text-text-muted" />
                  <span className="text-xs font-bold text-text-muted tabular-nums">{project.stars}</span>
                </div>
                <div className="flex-1 text-right">
                  <span className="text-xs font-bold text-accent group-hover:underline">View project</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <Button href="/explore" variant="outline">
            Browse All Projects <ArrowRight size={15} />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
