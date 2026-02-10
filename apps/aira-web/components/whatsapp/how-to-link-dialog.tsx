'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import {
  Settings,
  Link2,
  Phone,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface HowToLinkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const steps = [
  {
    icon: Settings,
    title: 'Open WhatsApp Settings',
    description: 'Go to Settings > Linked Devices on your phone',
  },
  {
    icon: Link2,
    title: 'Tap "Link a Device"',
    description: 'Select the option to link a new device',
  },
  {
    icon: Phone,
    title: 'Use Phone Number',
    description: 'Choose "Link with phone number instead" and enter the code',
  },
];

export function HowToLinkDialog({ open, onOpenChange }: HowToLinkDialogProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onOpenChange(false);
      setTimeout(() => setCurrentStep(0), 300); // Reset after closing
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // 👆 NEW: Handle Swipe Gestures
  const onDragEnd = (event: any, info: PanInfo) => {
    const swipeThreshold = 50;
    if (info.offset.x < -swipeThreshold) {
      handleNext(); // Swipe Left -> Next
    } else if (info.offset.x > swipeThreshold) {
      handlePrev(); // Swipe Right -> Back
    }
  };

  const step = steps[currentStep];
  const Icon = step.icon;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-[20px]">
        <SheetHeader>
          <SheetTitle className="text-center flex items-center justify-center gap-2">
            <HelpCircle className="w-5 h-5 text-muted-foreground" />
            How to Link WhatsApp
          </SheetTitle>
        </SheetHeader>

        {/* 👇 UX UPGRADE: 
            1. Added onClick to navigate
            2. Added drag="x" for swiping
            3. Added cursor-pointer to indicate interactivity
        */}
        <div 
          className="py-8 cursor-pointer select-none touch-pan-y"
          onClick={handleNext}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={onDragEnd}
              className="text-center active:scale-95 transition-transform"
            >
              {/* Icon */}
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-[#25D366]/10">
                <Icon className="h-10 w-10 text-[#25D366]" />
              </div>

              {/* Step number */}
              <p className="mb-2 text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Step {currentStep + 1} of {steps.length}
              </p>

              {/* Content */}
              <h3 className="text-xl font-bold text-foreground">
                {step.title}
              </h3>
              <p className="mt-2 text-base text-muted-foreground px-4">
                {step.description}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Progress dots */}
        <div className="mb-8 flex justify-center gap-2">
          {steps.map((_, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation(); // Prevent triggering the main click
                setCurrentStep(index);
              }}
              className={cn(
                'h-2 rounded-full transition-all duration-300',
                index === currentStep
                  ? 'w-8 bg-[#25D366]'
                  : 'w-2 bg-muted hover:bg-muted-foreground',
              )}
            />
          ))}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            disabled={currentStep === 0}
            className="rounded-full"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back
          </Button>

          <Button 
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            className="rounded-full bg-[#25D366] hover:bg-[#25D366]/90 text-white"
          >
            {currentStep === steps.length - 1 ? (
              'Finish'
            ) : (
              <>
                Next
                <ChevronRight className="ml-1 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
