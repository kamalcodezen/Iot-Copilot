'use client';

import { motion } from 'framer-motion';
import { Quote, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import Button from '@/components/ui/Button';

const testimonials = [
  {
    quote: 'IoT Copilot cut our prototype development time from 3 weeks to 2 days. The AI-generated wiring diagrams alone saved us hundreds of hours.',
    author: 'Dr. Sarah Chen',
    role: 'Head of IoT Engineering',
    company: 'Siemens Digital Industries',
    rating: 5,
  },
  {
    quote: 'We deployed 2,000+ sensors across 12 factories using IoT Copilot. The predictive maintenance AI caught a critical failure before it caused a shutdown.',
    author: 'Marcus Rivera',
    role: 'VP of Manufacturing Technology',
    company: 'Bosch',
    rating: 5,
  },
  {
    quote: 'The AI debugger found a floating pin issue in our circuit that three senior engineers missed. It paid for itself in that single debug session.',
    author: 'Priya Patel',
    role: 'Lead Embedded Engineer',
    company: 'Tesla',
    rating: 5,
  },
  {
    quote: 'As a solo founder, IoT Copilot is like having a team of 5 engineers. It generates production-quality code and catches my mistakes constantly.',
    author: 'James Mitchell',
    role: 'Founder & CTO',
    company: 'AgriSense Technologies',
    rating: 5,
  },
];

export default function Testimonials() {
  const [active, setActive] = useState(0);

  const prev = () => setActive((a) => (a === 0 ? testimonials.length - 1 : a - 1));
  const next = () => setActive((a) => (a === testimonials.length - 1 ? 0 : a + 1));

  return (
    <section className="py-24 relative overflow-hidden" id="testimonials">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/[0.02] to-transparent" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-sm text-xs font-bold text-accent mb-5 border border-accent/10 tracking-wide uppercase">
            <Quote size={12} /> Testimonials
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-text-primary mb-4 tracking-tight">
            Trusted by{' '}<span className="gradient-text">Industry Leaders</span>
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto text-base font-semibold">
            Hear from the engineers and companies shipping production IoT systems with our platform.
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          <div className="dashboard-card p-8 sm:p-10 relative overflow-hidden">
            <Quote className="absolute top-6 right-6 w-16 h-16 text-accent/5" />

            <div className="flex items-center gap-1 mb-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={14} className="fill-accent text-accent" />
              ))}
            </div>

            <div className="min-h-[120px]">
              <motion.blockquote
                key={active}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="text-base sm:text-lg text-text-primary font-semibold leading-relaxed mb-6"
              >
                &ldquo;{testimonials[active].quote}&rdquo;
              </motion.blockquote>
            </div>

            <motion.div
              key={`author-${active}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-3 pt-6 border-t border-border-default"
            >
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-accent/30 to-blue-500/10 flex items-center justify-center text-sm font-bold text-accent shrink-0">
                {testimonials[active].author.split(' ').map((n) => n[0]).join('')}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-text-primary truncate">{testimonials[active].author}</div>
                <div className="text-xs font-semibold text-text-muted truncate">{testimonials[active].role} &middot; {testimonials[active].company}</div>
              </div>
            </motion.div>

            <div className="flex items-center justify-between mt-6 pt-4 border-t border-border-default">
              <div className="flex items-center gap-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActive(i)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === active ? 'w-6 bg-accent' : 'w-1.5 bg-text-muted/30'
                    }`}
                  />
                ))}
              </div>
              <div className="flex items-center gap-2">
                <button onClick={prev} className="h-8 w-8 rounded-lg bg-bg-surface border border-border-default flex items-center justify-center hover:bg-bg-secondary transition-colors">
                  <ChevronLeft size={14} className="text-text-secondary" />
                </button>
                <button onClick={next} className="h-8 w-8 rounded-lg bg-bg-surface border border-border-default flex items-center justify-center hover:bg-bg-secondary transition-colors">
                  <ChevronRight size={14} className="text-text-secondary" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
