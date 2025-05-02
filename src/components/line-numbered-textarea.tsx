
"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Textarea, type TextareaProps } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface LineNumberedTextareaProps extends Omit<TextareaProps, 'value' | 'onChange'> {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  textareaClassName?: string; // Optional class specifically for the inner textarea
}

export const LineNumberedTextarea = React.forwardRef<
  HTMLDivElement,
  LineNumberedTextareaProps
>(({ value, onChange, className, textareaClassName, ...props }, ref) => {
  const [lineCount, setLineCount] = useState(1);
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const calculateLineCount = useCallback((text: string) => {
    const lines = text.split('\n');
    // Ensure at least one line number is shown even for empty input
    return lines.length || 1;
  }, []);

  useEffect(() => {
    setLineCount(calculateLineCount(value));
  }, [value, calculateLineCount]);

  const handleScroll = () => {
    if (lineNumbersRef.current && textareaRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(event); // Propagate the change event
    // Recalculate lines immediately on change
    setLineCount(calculateLineCount(event.target.value));
    // Ensure scroll sync after potential height change
    requestAnimationFrame(handleScroll);
  };

  // Adjust line numbers height on mount and resize
  useEffect(() => {
    const adjustHeight = () => {
       if (lineNumbersRef.current && textareaRef.current) {
          // Match line numbers div height to textarea height
          const textareaHeight = textareaRef.current.scrollHeight;
          lineNumbersRef.current.style.height = `${textareaHeight}px`;
       }
    }
    adjustHeight();
    const resizeObserver = new ResizeObserver(adjustHeight);
    if (textareaRef.current) {
        resizeObserver.observe(textareaRef.current);
    }
    window.addEventListener('resize', adjustHeight);
    return () => {
        if (textareaRef.current) {
            resizeObserver.unobserve(textareaRef.current);
        }
        window.removeEventListener('resize', adjustHeight);
    };

  }, [value]); // Re-run when value changes as it might affect scrollHeight

  return (
    <div className={cn("flex w-full border border-input rounded-md overflow-hidden", className)} ref={ref}>
      <div
        ref={lineNumbersRef}
        className="p-2 pr-3 text-right text-sm text-muted-foreground bg-secondary/30 select-none overflow-y-hidden"
        style={{ fontFamily: 'monospace', lineHeight: '1.5' }} // Match textarea line height
      >
        {Array.from({ length: lineCount }, (_, i) => (
          <div key={i}>{i + 1}</div>
        ))}
      </div>
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={handleTextChange}
        onScroll={handleScroll}
        className={cn(
          'flex-1 resize-none border-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 p-2', // Remove border and adjust padding
           'font-mono', // Ensure monospace font
           'leading-[1.5]', // Ensure consistent line height
           textareaClassName // Apply specific textarea class
        )}
        {...props}
      />
    </div>
  );
});

LineNumberedTextarea.displayName = 'LineNumberedTextarea';
