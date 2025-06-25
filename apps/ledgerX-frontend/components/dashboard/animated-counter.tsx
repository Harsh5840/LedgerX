"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}

export function AnimatedCounter({ 
  value, 
  duration = 2, 
  prefix = "", 
  suffix = "",
  decimals = 0 
}: AnimatedCounterProps) {
  const countRef = useRef<HTMLSpanElement>(null);
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (countRef.current) {
      gsap.to({ value: displayValue }, {
        value: value,
        duration: duration,
        ease: "power2.out",
        onUpdate: function() {
          setDisplayValue(this.targets()[0].value);
        }
      });
    }
  }, [value, duration, displayValue]);

  const formatValue = (val: number) => {
    return val.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <span ref={countRef} className="tabular-nums">
      {prefix}{formatValue(displayValue)}{suffix}
    </span>
  );
}