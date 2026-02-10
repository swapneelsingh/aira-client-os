'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion'; // 👈 Import framer-motion for the UX improvement
import { 
  Settings, 
  Link as LinkIcon, 
  Plus, 
  Hash, 
  ArrowUp,
  ChevronRight,
  Shield,
  User,
  ScanLine
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel'; 

const steps = [
  {
    id: 1,
    title: 'Go to Linked Devices',
    visual: (
      // SLIDE 1
      <div className="w-full max-w-[260px] overflow-hidden rounded-xl border border-white/10 bg-[#1c1c1c] p-3 shadow-xl">
        <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <Settings className="h-4 w-4 text-white" />
                <span className="text-sm font-bold text-white">Settings</span>
            </div>
            <div className="h-1 w-6 rounded-full bg-white/20" />
        </div>
        <div className="space-y-1.5">
            <div className="flex items-center gap-2 p-1.5 opacity-50">
                <User className="h-4 w-4 text-muted-foreground" />
                <div className="h-1.5 w-16 rounded bg-white/20" />
            </div>
            <div className="relative flex items-center justify-between overflow-hidden rounded-lg bg-[#2a2a2a] p-2 ring-1 ring-white/10">
                <div className="flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10">
                        <LinkIcon className="h-3 w-3 text-white" />
                    </div>
                    <div>
                        <span className="block text-xs font-semibold text-white">Linked Devices</span>
                        <span className="block text-[9px] text-[#25D366]">Tap here</span>
                    </div>
                </div>
                <ChevronRight className="h-3 w-3 text-white/40" />
            </div>
            <div className="flex items-center gap-2 p-1.5 opacity-50">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <div className="h-1.5 w-20 rounded bg-white/20" />
            </div>
        </div>
      </div>
    ),
  },
  {
    id: 2,
    title: 'Tap "Link a Device"',
    visual: (
      // SLIDE 2
      <div className="w-full max-w-[260px] space-y-3">
        <div className="relative overflow-hidden rounded-xl border border-white/10 bg-[#1c1c1c] p-1 shadow-xl">
            <div className="flex items-center justify-between rounded-lg bg-black p-3">
                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#2a2a2a]">
                        <Plus className="h-4 w-4 text-white" />
                    </div>
                    <div>
                        <span className="block text-xs font-bold text-white">Link a Device</span>
                        <span className="block text-[9px] text-muted-foreground">Connect a new device</span>
                    </div>
                </div>
                <div className="rounded-full bg-[#b6b09f] px-2.5 py-0.5 text-[9px] font-bold text-black shadow-sm">
                    Tap
                </div>
            </div>
        </div>
        <div className="flex items-center gap-2 pl-2 text-[10px] text-muted-foreground">
            <ScanLine className="h-3.5 w-3.5" />
            <span>A QR code scanner will appear</span>
        </div>
      </div>
    ),
  },
  {
    id: 3,
    title: 'Link with phone number',
    visual: (
      // SLIDE 3
      <div className="w-full max-w-[260px] space-y-3">
          <div className="flex items-center gap-2 pl-2 text-[10px] text-muted-foreground line-through opacity-60">
            <ScanLine className="h-3.5 w-3.5" />
            <span>Skip QR scanning</span>
        </div>
        <div className="relative overflow-hidden rounded-xl bg-[#b6b09f] p-3 text-black shadow-xl">
            <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-black/10">
                    <Hash className="h-4 w-4 text-black" />
                </div>
                <div className="space-y-0.5">
                    <span className="block text-xs font-bold leading-tight">Link with phone number instead</span>
                    <span className="block text-[9px] opacity-70">Enter the 8-digit code shown above</span>
                </div>
            </div>
        </div>
        <div className="flex items-center gap-2 pl-2 text-[10px] text-[#25D366]">
            <ArrowUp className="h-3.5 w-3.5" />
            <span>Tap this option in WhatsApp</span>
        </div>
      </div>
    ),
  },
];

export function InstructionSteps() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  // 👇 FEATURE: Click to advance (with Loop)
  const handleCardClick = useCallback(() => {
    if (!api) return;
    
    if (api.canScrollNext()) {
      api.scrollNext();
    } else {
      // If at the end, loop back to start for better flow
      api.scrollTo(0);
    }
  }, [api]);

  return (
    <div className="mt-2 w-full max-w-[300px] mx-auto flex flex-col items-center">
      
      {/* Dots Indicator */}
      <div className="mb-2 flex gap-1.5">
          {steps.map((_, idx) => (
          <button
              key={idx}
              onClick={() => api?.scrollTo(idx)}
              className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              idx === current ? "w-8 bg-white/40" : "w-1.5 bg-white/10"
              )}
          />
          ))}
      </div>

      <Carousel setApi={setApi} className="w-full">
        <CarouselContent>
          {steps.map((step) => (
            <CarouselItem key={step.id}>
              {/* 👇 UX IMPROVEMENT: 
                 1. 'cursor-pointer' lets them know it's interactive.
                 2. motion.div with 'whileTap' gives tactile feedback (shrinks slightly).
                 3. onClick triggers the slide advance.
              */}
              <motion.div 
                whileTap={{ scale: 0.96 }}
                onClick={handleCardClick}
                className="flex flex-col items-center justify-center select-none min-h-[140px] cursor-pointer"
              >
                {step.visual}
              </motion.div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Step Title & Hint */}
      <div className="mt-2 flex flex-col items-center gap-1">
        <p className="text-xs text-muted-foreground">
            Step {current + 1}: <span className="text-foreground font-medium">{steps[current].title}</span>
        </p>
        <p className="text-[10px] text-white/20">Tap card for next step</p>
      </div>
    </div>
  );
}