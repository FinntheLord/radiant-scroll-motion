
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
  const animationFrameRef = useRef<number>();
  const [time, setTime] = useState(0);

  // Autonomous animation effect
  useEffect(() => {
    let lastTime = performance.now();
    
    const animateGradient = (currentTime: number) => {
      // Calculate time delta
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;
      
      // Update animation time
      setTime(prevTime => prevTime + deltaTime * 0.001); // convert to seconds
      
      // Continue animation loop
      animationFrameRef.current = requestAnimationFrame(animateGradient);
    };
    
    if (animate) {
      animationFrameRef.current = requestAnimationFrame(animateGradient);
    }
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [animate]);
  
  // Calculate gradient position based on time
  useEffect(() => {
    if (animate && gradientRef.current) {
      // Use sine and cosine for smooth circular motion
      const moveX = Math.sin(time * 0.2) * 30; 
      const moveY = Math.cos(time * 0.3) * 20;
      
      gradientRef.current.style.transform = `translate(${moveX}px, ${moveY}px)`;
    }
  }, [time, animate]);

  // Keep mouse tracking for additional interactivity if needed
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

  return (
    <div className={cn("relative overflow-hidden w-full", containerClassName)}>
      {/* Main gradient */}
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
      
      {/* Secondary gradient */}
      <div 
        className={cn(
          "absolute inset-0 opacity-40 transition-transform duration-500 ease-out",
        )}
        style={{
          backgroundImage: 
            "radial-gradient(circle at 70% 60%, rgba(151, 71, 255, 0.7) 0, rgba(255, 54, 163, 0.4) 30%, rgba(255, 122, 0, 0.3) 60%, transparent 100%)",
          backgroundSize: "120% 120%",
          filter: "blur(80px)",
          animation: "floatingGlow 15s infinite alternate ease-in-out",
        }}
      />
      
      {/* Blue glow */}
      <div 
        className="absolute inset-0 opacity-30 blue-glow"
        style={{
          top: '10%',
          left: '5%',
          width: '50%',
          height: '50%',
          animationDelay: "-2s"
        }}
      />
      
      {/* Pink glow */}
      <div 
        className="absolute inset-0 opacity-30 pink-glow"
        style={{
          top: '50%',
          left: '70%',
          width: '60%',
          height: '40%',
          animationDelay: "-5s"
        }}
      />
      
      {/* Purple glow */}
      <div 
        className="absolute inset-0 opacity-30 purple-glow"
        style={{
          top: '70%',
          left: '20%',
          width: '45%',
          height: '45%',
          animationDelay: "-8s"
        }}
      />
      
      {/* Orange glow */}
      <div 
        className="absolute inset-0 opacity-30 orange-glow"
        style={{
          top: '30%',
          left: '60%',
          width: '55%',
          height: '40%',
          animationDelay: "-12s"
        }}
      />
      
      <div className={cn("relative z-10", className)}>
        {children}
      </div>
    </div>
  );
}
