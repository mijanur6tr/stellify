'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { MessageSquareText, CheckCircle2, Truck, Sparkles, Wind } from 'lucide-react';

export function HowOrderingWorks() {
  const [hoveredStep, setHoveredStep] = React.useState<string | null>(null);

  const steps = [
    {
      num: '01',
      id: 'step-chat',
      icon: MessageSquareText,
      title: 'Chat or Select',
      description:
        'Browse our lookbook or consult with our AI Style Concierge to pick your dream bangle set, matching your saree or lehenga.',
      badge: 'Bespoke Consultation',
    },
    {
      num: '02',
      id: 'step-confirm',
      icon: CheckCircle2,
      title: 'Confirm with Address',
      description:
        'Provide your delivery address and phone number right in chat or at checkout. No account or upfront card payment required.',
      badge: 'Zero Prepayment',
    },
    {
      num: '03',
      id: 'step-delivery',
      icon: Truck,
      title: 'Cash on Delivery at Your Door',
      description:
        'Our artisans pack your set with love. Pay in cash directly to the courier upon delivery anywhere across Bangladesh.',
      badge: 'All 64 Districts',
    },
  ];

  return (
    <section className="py-24 sm:py-36 px-6 sm:px-12 bg-[#071326] relative overflow-hidden border-t border-[#162B4C]">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#C5A059]/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-2xl mx-auto mb-16 sm:mb-20"
        >
          <span className="text-[10px] font-sans font-medium uppercase tracking-[0.28em] text-[#C5A059] block mb-2">
            Effortless &amp; Secure
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl text-[#FAF7F2] font-light tracking-tight">
            How Ordering <span className="italic text-[#C5A059]">Works</span>
          </h2>
          <p className="text-xs sm:text-sm font-sans text-[#D4C9BA]/70 mt-3 font-light">
            Pure Cash on Delivery (COD) peace of mind across all 64 districts of Bangladesh.
          </p>
        </motion.div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connector Line behind steps on desktop */}
          <div className="hidden md:block absolute top-[38%] left-[15%] right-[15%] h-[1px] bg-gradient-to-r from-transparent via-[#C5A059]/30 to-transparent z-0" />

          {steps.map((step, idx) => {
            const isHovered = hoveredStep === step.id;

            return (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{
                  duration: 0.75,
                  delay: idx * 0.15,
                  ease: [0.16, 1, 0.3, 1],
                }}
                onMouseEnter={() => setHoveredStep(step.id)}
                onMouseLeave={() => setHoveredStep(null)}
                className="relative z-10 bg-[#0B1C36] border border-[#162B4C] hover:border-[#C5A059] p-8 rounded-sm flex flex-col items-center text-center transition-all duration-500 group shadow-lg hover:shadow-[0_0_25px_rgba(197,160,89,0.15)] cursor-pointer"
              >
                {/* Step Number Badge */}
                <div className="text-[10px] font-sans font-semibold tracking-[0.25em] text-[#C5A059] mb-4 bg-[#071326] px-2.5 py-1 rounded-sm border border-[#162B4C]">
                  STEP {step.num}
                </div>

                {/* Animated Interactive Icon Circle */}
                <div className="relative w-20 h-20 rounded-full bg-[#071326] border border-[#C5A059]/40 flex items-center justify-center text-[#C5A059] group-hover:border-[#E5C378] group-hover:shadow-[0_0_20px_rgba(229,195,120,0.35)] transition-all duration-300 mb-6">
                  {/* Step 1: Chat Micro-interaction */}
                  {step.id === 'step-chat' && (
                    <div className="relative flex items-center justify-center">
                      <motion.div
                        animate={
                          isHovered
                            ? {
                                scale: [1, 1.22, 0.95, 1.15, 1],
                                rotate: [0, -10, 8, -4, 0],
                              }
                            : { scale: 1, rotate: 0 }
                        }
                        transition={{ duration: 0.6, ease: 'easeInOut' }}
                      >
                        <MessageSquareText className="w-8 h-8 stroke-[1.4] text-[#E5C378]" />
                      </motion.div>

                      {/* Sparkles around chat on hover */}
                      {isHovered && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute -top-3 -right-3 text-[#FAF7F2]"
                        >
                          <Sparkles className="w-4 h-4 text-[#E5C378] animate-spin" />
                        </motion.div>
                      )}
                    </div>
                  )}

                  {/* Step 2: Confirm Checkmark Micro-interaction */}
                  {step.id === 'step-confirm' && (
                    <div className="relative flex items-center justify-center">
                      {/* Radiating Ripple Ring on Hover */}
                      {isHovered && (
                        <motion.span
                          initial={{ scale: 0.8, opacity: 0.8 }}
                          animate={{ scale: 1.5, opacity: 0 }}
                          transition={{ repeat: Infinity, duration: 1, ease: 'easeOut' }}
                          className="absolute inset-0 rounded-full border border-emerald-400"
                        />
                      )}

                      <motion.div
                        animate={
                          isHovered
                            ? {
                                scale: [1, 1.25, 1],
                                rotate: [0, 10, -5, 0],
                              }
                            : { scale: 1, rotate: 0 }
                        }
                        transition={{ duration: 0.5 }}
                      >
                        <CheckCircle2 className="w-8 h-8 stroke-[1.4] text-emerald-400" />
                      </motion.div>
                    </div>
                  )}

                  {/* Step 3: Delivery Truck Driving Micro-interaction */}
                  {step.id === 'step-delivery' && (
                    <div className="relative flex items-center justify-center overflow-visible">
                      {/* Motion Speed Lines fading in behind the truck */}
                      <motion.div
                        animate={
                          isHovered
                            ? { opacity: [0, 1, 0], x: [-2, -10, -18] }
                            : { opacity: 0, x: -2 }
                        }
                        transition={{
                          repeat: isHovered ? Infinity : 0,
                          duration: 0.45,
                          ease: 'linear',
                        }}
                        className="absolute -left-3 text-[#E5C378]"
                      >
                        <Wind className="w-4 h-4 opacity-75" />
                      </motion.div>

                      {/* The Truck Driving & Bouncing */}
                      <motion.div
                        animate={
                          isHovered
                            ? {
                                x: [0, 8, 2, 7, 0],
                                y: [0, -2, 1, -1.5, 0],
                              }
                            : { x: 0, y: 0 }
                        }
                        transition={{
                          repeat: isHovered ? Infinity : 0,
                          duration: 0.8,
                          ease: 'easeInOut',
                        }}
                      >
                        <Truck className="w-8 h-8 stroke-[1.4] text-[#E5C378]" />
                      </motion.div>
                    </div>
                  )}
                </div>

                <h3 className="font-serif text-2xl text-[#FAF7F2] font-normal mb-3 group-hover:text-[#E5C378] transition-colors">
                  {step.title}
                </h3>

                <p className="text-xs font-sans text-[#FAF7F2]/70 leading-relaxed font-light mb-4">
                  {step.description}
                </p>

                <span className="mt-auto text-[9px] uppercase font-sans tracking-[0.2em] text-[#C5A059] font-medium bg-[#071326] px-3 py-1 rounded-full border border-[#162B4C] group-hover:border-[#C5A059]/40 transition-colors">
                  {step.badge}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default HowOrderingWorks;
