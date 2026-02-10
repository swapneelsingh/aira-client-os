'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Copy, RefreshCw, Check, HelpCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { HowToLinkDialog } from './how-to-link-dialog'; 

// 👇 1. NEW COMPONENT: Numeric Countdown Timer
function NumericCountdownButton({ 
  onClick, 
  isLoading, 
  resetKey // Uses the code itself as a key to reset timer when code changes
}: { 
  onClick: () => void; 
  isLoading?: boolean; 
  resetKey?: string;
}) {
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes (300s)

  useEffect(() => {
    // Reset timer to 5:00 whenever the code changes
    setTimeLeft(300);
  }, [resetKey]);

  useEffect(() => {
    if (isLoading) return; // Pause if loading
    if (timeLeft <= 0) return; // Stop at 0

    const intervalId = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [isLoading, timeLeft]);

  // Format time (e.g., 4:59)
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  const isExpired = timeLeft === 0;

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      disabled={isLoading}
      className={cn(
        "gap-2 min-w-[140px]", // Fixed width prevents jitter
        isExpired && "text-red-500 hover:text-red-600"
      )}
    >
      <RefreshCw 
        className={cn(
          "h-4 w-4", 
          isLoading && "animate-spin text-primary",
          !isLoading && isExpired && "text-red-500"
        )} 
      />
      
      {/* Show "New Code" or the Timer */}
      <span className="font-mono tabular-nums">
        {isLoading ? 'Refreshing...' : isExpired ? 'Code Expired' : `New Code (${timeString})`}
      </span>
    </Button>
  );
}

interface LinkCodeDisplayProps {
  code: string;
  onRefresh?: () => void;
  onInfoClick?: () => void;
  isRefreshing?: boolean;
  className?: string;
}

export function LinkCodeDisplay({
  code,
  onRefresh,
  onInfoClick,
  isRefreshing = false,
  className,
}: LinkCodeDisplayProps) {
  const [copied, setCopied] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const formattedCode = code.slice(0, 4) + ' ' + code.slice(4);

  return (
    <>
      <Card className={cn('overflow-hidden', className)}>
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Code Display */}
            <div className="text-center">
              <p className="mb-2 text-sm text-muted-foreground">
                Enter this code in WhatsApp
              </p>
              <motion.div
                key={code}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="font-mono text-4xl font-bold tracking-[0.2em] text-foreground md:text-5xl"
              >
                {formattedCode}
              </motion.div>
            </div>

            {/* Actions Row */}
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="gap-2"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 text-green-500" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy Code
                  </>
                )}
              </Button>

              {/* 👇 2. UPDATED: Using Numeric Timer */}
              {onRefresh && (
                <NumericCountdownButton 
                  onClick={onRefresh} 
                  isLoading={isRefreshing}
                  resetKey={code} // Resets timer when code updates
                />
              )}
            </div>

            {/* How to Link Button */}
            <div className="pt-2 flex justify-center">
                <Button 
                    variant="link" 
                    size="sm" 
                    onClick={() => setShowHelp(true)}
                    className="text-muted-foreground hover:text-primary gap-1.5"
                >
                    <HelpCircle className="w-4 h-4" />
                    How to link my device?
                </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <HowToLinkDialog open={showHelp} onOpenChange={setShowHelp} />
    </>
  );
}