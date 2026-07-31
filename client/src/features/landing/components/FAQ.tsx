'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Plus, Minus, HelpCircle } from 'lucide-react';

const faqs = [
  {
    question: 'What microcontrollers and boards do you support?',
    answer: 'We support ESP32, ESP8266, Arduino (Uno, Mega, R3, R4, Nano), Raspberry Pi (3, 4, 5, Pico), STM32, Teensy, and many more. Our AI automatically detects your board from your circuit description and generates compatible code.',
  },
  {
    question: 'Can I use IoT Copilot with existing hardware?',
    answer: 'Absolutely. You can describe your existing setup and the AI will generate code tailored to your current components. You can also upload schematics and code for AI-powered debugging and optimization.',
  },
  {
    question: 'How does the AI debugger work?',
    answer: 'Upload your circuit diagram (image or Fritzing file) and your code. The AI analyzes both simultaneously, identifying mismatches between your wiring and software, pinpointing logic errors, and suggesting fixes with explanations.',
  },
  {
    question: 'Is my code and project data private?',
    answer: 'Yes. All projects are encrypted at rest and in transit. We offer end-to-end encryption for enterprise customers. Your code is never used to train our models unless you explicitly opt in. SOC 2 compliance is on the roadmap for Q2 2027.',
  },
  {
    question: 'What protocols and connectivity options are available?',
    answer: 'WiFi, BLE 5.0, Zigbee 3.0, LoRaWAN, NB-IoT, Ethernet, CAN bus, SPI, I2C, UART, and more. Our platform generates code for any combination of protocols with automatic conflict detection.',
  },
  {
    question: 'Do you offer OTA (over-the-air) updates?',
    answer: 'Yes, our platform includes a built-in OTA update system. You can push firmware updates to thousands of devices simultaneously with rollback support and staged rollouts for production safety.',
  },
  {
    question: 'Can I simulate my circuit before building it?',
    answer: 'Yes, our visual circuit designer includes a simulation engine that tests your circuit virtually. You can verify signal paths, check voltage levels, and validate logic before ordering a single component.',
  },
  {
    question: 'What kind of support do you offer?',
    answer: 'Free tier includes community support and documentation. Pro tier gets priority email support within 24 hours. Enterprise tier includes dedicated Slack channel, phone support, and a named solutions engineer.',
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section className="py-24 relative bg-bg-secondary/30 overflow-hidden" id="faq">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-sm text-xs font-bold text-accent mb-5 border border-accent/10 tracking-wide uppercase">
            <HelpCircle size={12} /> FAQ
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-text-primary mb-4 tracking-tight">
            Frequently Asked{' '}<span className="gradient-text">Questions</span>
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto text-base font-semibold">
            Everything you need to know about IoT Copilot. Can&apos;t find what you&apos;re looking for? Reach out to our team.
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04, duration: 0.3 }}
              className="dashboard-card overflow-hidden"
            >
              <button
                onClick={() => toggle(i)}
                className="w-full flex items-center justify-between p-4 sm:p-5 text-left"
              >
                <span className="text-sm sm:text-base font-bold text-text-primary pr-4">{faq.question}</span>
                <div className="h-8 w-8 rounded-lg bg-bg-surface border border-border-default flex items-center justify-center shrink-0">
                  {openIndex === i ? <Minus size={13} className="text-accent" /> : <Plus size={13} className="text-text-secondary" />}
                </div>
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <p className="text-sm text-text-secondary leading-relaxed px-4 sm:px-5 pb-4 sm:pb-5">{faq.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
