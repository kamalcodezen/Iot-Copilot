'use client';

import { motion } from 'framer-motion';
import { Cpu, Github, Twitter, Linkedin, Mail, Heart, ArrowUp } from 'lucide-react';
import Link from 'next/link';

const footerLinks = {
  Platform: [
    { label: 'Features', href: '/#features' },
    { label: 'AI Engine', href: '/#ai-features' },
    { label: 'How It Works', href: '/#how-it-works' },
    { label: 'Roadmap', href: '/#roadmap' },
  ],
  Resources: [
    { label: 'Community Projects', href: '/explore' },
    { label: 'Contact Us', href: 'mailto:hello@iotcopilot.com' },
  ],
};

export default function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="relative border-t border-border-default bg-bg-secondary/50 pt-16 pb-28 lg:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 lg:gap-12">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-accent to-blue-600 flex items-center justify-center shadow-lg shadow-accent/20">
                <Cpu className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-extrabold text-text-primary tracking-tight">IoT Copilot</span>
            </Link>
            <p className="text-xs font-semibold text-text-muted leading-relaxed mb-5 max-w-xs">
              AI-powered IoT development platform. Design, debug, and deploy connected devices at enterprise scale.
            </p>
            <div className="flex items-center gap-2">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="h-8 w-8 rounded-lg bg-bg-surface border border-border-default flex items-center justify-center hover:bg-accent/10 hover:border-accent/30 transition-all duration-200">
                <Github size={14} className="text-text-secondary" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter / X" className="h-8 w-8 rounded-lg bg-bg-surface border border-border-default flex items-center justify-center hover:bg-accent/10 hover:border-accent/30 transition-all duration-200">
                <Twitter size={14} className="text-text-secondary" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="h-8 w-8 rounded-lg bg-bg-surface border border-border-default flex items-center justify-center hover:bg-accent/10 hover:border-accent/30 transition-all duration-200">
                <Linkedin size={14} className="text-text-secondary" />
              </a>
              <a href="mailto:hello@iotcopilot.com" aria-label="Email us" className="h-8 w-8 rounded-lg bg-bg-surface border border-border-default flex items-center justify-center hover:bg-accent/10 hover:border-accent/30 transition-all duration-200">
                <Mail size={14} className="text-text-secondary" />
              </a>
            </div>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider mb-4">{category}</h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-xs font-semibold text-text-muted hover:text-accent transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-border-default flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs font-semibold text-text-muted flex items-center gap-1">
            &copy; {new Date().getFullYear()} IoT Copilot. Built with <Heart size={11} className="text-rose-400" /> for the IoT community.
          </p>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-xs font-bold text-text-secondary hover:text-accent transition-colors duration-200"
          >
            Back to top <ArrowUp size={12} />
          </button>
        </div>
      </div>
    </footer>
  );
}
