
"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export function BackgroundGradientAnimation({
  children,
  className,
  containerClassName,
  gradientClassName,
  animate = true,
}: {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  gradientClassName?: string;
  animate?: boolean;
}) {
  const gradientRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Get mouse position relative to viewport
      const x = e.clientX;
      const y = e.clientY;
      
      // Update the state
      if (animate) {
        setMousePosition({ x, y });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [animate]);

  useEffect(() => {
    if (animate && gradientRef.current) {
      // Calculate the center of the gradient based on mouse position
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      // Calculate position percentage (0 to 1)
      const xPercent = mousePosition.x / width;
      const yPercent = mousePosition.y / height;
      
      // Move the gradient slightly based on mouse position
      const moveX = (xPercent - 0.5) * 20; 
      const moveY = (yPercent - 0.5) * 20;
      
      gradientRef.current.style.transform = `translate(${moveX}px, ${moveY}px)`;
    }
  }, [mousePosition, animate]);

  return (
    <div className={cn("relative overflow-hidden w-full", containerClassName)}>
      <div 
        ref={gradientRef}
        className={cn(
          "absolute inset-0 opacity-50 transition-transform duration-500 ease-out",
          gradientClassName
        )}
        style={{
          backgroundImage: 
            "radial-gradient(circle at center, rgba(255, 122, 0, 0.8) 0, rgba(255, 54, 163, 0.5) 25%, rgba(151, 71, 255, 0.3) 50%, rgba(8, 50, 162, 0.2) 75%, transparent 100%)",
          backgroundSize: "100% 100%",
          filter: "blur(100px)",
        }}
      />
      <div className={cn("relative z-10", className)}>
        {children}
      </div>
    </div>
  );
}
