import React, { useEffect, useRef } from 'react';

interface FireworkCanvasProps {
  isActive: boolean;
}

const FireworkCanvas: React.FC<FireworkCanvasProps> = ({ isActive }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    
    const resizeObserver = new ResizeObserver(() => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    });
    resizeObserver.observe(document.body);

    canvas.width = width;
    canvas.height = height;

    // Physics constants
    const GRAVITY = 0.04;
    const FRICTION = 0.99;
    
    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      alpha: number;
      color: string;
      decay: number;

      constructor(x: number, y: number, color: string, speedMultiplier: number) {
        this.x = x;
        this.y = y;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 3 * speedMultiplier + 1;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.alpha = 1;
        this.color = color;
        this.decay = Math.random() * 0.015 + 0.005;
      }

      update() {
        this.vx *= FRICTION;
        this.vy *= FRICTION;
        this.vy += GRAVITY;
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= this.decay;
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    class Firework {
      x: number;
      y: number;
      targetY: number;
      vy: number;
      color: string;
      exploded: boolean;
      particles: Particle[];

      constructor() {
        this.x = Math.random() * width;
        this.y = height;
        this.targetY = Math.random() * (height * 0.6); // Target upper 60%
        this.vy = -Math.random() * 3 - 8; // Initial launch speed
        const colors = ['#ff0044', '#00ff99', '#00ccff', '#ffcc00', '#9900ff'];
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.exploded = false;
        this.particles = [];
      }

      update() {
        if (!this.exploded) {
          this.y += this.vy;
          this.vy += GRAVITY;
          
          // Explode if reached peak or slowed down enough
          if (this.vy >= -1 || this.y <= this.targetY) {
            this.explode();
          }
        } else {
          for (let i = this.particles.length - 1; i >= 0; i--) {
            this.particles[i].update();
            if (this.particles[i].alpha <= 0) {
              this.particles.splice(i, 1);
            }
          }
        }
      }

      explode() {
        this.exploded = true;
        const particleCount = 60;
        for (let i = 0; i < particleCount; i++) {
          this.particles.push(new Particle(this.x, this.y, this.color, 1.5));
        }
        // Flash effect
        ctx!.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx!.fillRect(0, 0, width, height);
      }

      draw(ctx: CanvasRenderingContext2D) {
        if (!this.exploded) {
          ctx.save();
          ctx.fillStyle = this.color;
          ctx.beginPath();
          ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        } else {
          this.particles.forEach(p => p.draw(ctx));
        }
      }

      isDead() {
        return this.exploded && this.particles.length === 0;
      }
    }

    let fireworks: Firework[] = [];
    let animationFrameId: number;
    let tick = 0;

    const loop = () => {
      // Create trailing effect
      ctx.fillStyle = 'rgba(15, 23, 42, 0.2)'; // Match bg-slate-900 with opacity
      ctx.fillRect(0, 0, width, height);

      if (isActive) {
        // Spawn chance
        if (tick % 25 === 0) { 
           fireworks.push(new Firework());
        }
        if (Math.random() < 0.05) {
           fireworks.push(new Firework()); // Random extra spawns
        }
      }

      for (let i = fireworks.length - 1; i >= 0; i--) {
        fireworks[i].update();
        fireworks[i].draw(ctx);
        if (fireworks[i].isDead()) {
          fireworks.splice(i, 1);
        }
      }

      tick++;
      animationFrameId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
    };
  }, [isActive]);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
    />
  );
};

export default FireworkCanvas;