"use client";

import React, { useEffect, useRef } from "react";

export function CosmicBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Center point
    const centerX = () => canvas.width / 2;
    const centerY = () => canvas.height / 2;

    // Star class for warp effect
    class Star {
      x: number;
      y: number;
      z: number;
      size: number;
      opacity: number;
      speed: number;
      color: string;

      constructor() {
        this.reset(true);
      }

      reset(randomZ = false) {
        // Random position in X-Y plane
        this.x = (Math.random() - 0.5) * canvas.width * 2;
        this.y = (Math.random() - 0.5) * canvas.height * 2;
        // Z depth (0 is far, canvas width is close)
        this.z = randomZ ? Math.random() * canvas.width : canvas.width;
        this.size = Math.random() * 2.5 + 0.3;
        this.opacity = Math.random() * 0.6 + 0.4;
        this.speed = Math.random() * 6 + 2;

        // Add slight color variation
        const colors = ["255, 255, 255", "200, 220, 255", "255, 230, 200", "230, 200, 255"];
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        // Move star closer (decrease Z)
        this.z -= this.speed;

        // Reset if star passes the camera
        if (this.z <= 0) {
          this.reset();
        }
      }

      draw() {
        // Project 3D to 2D
        const cx = centerX();
        const cy = centerY();
        const scale = canvas.width / this.z;

        const screenX = cx + this.x * scale;
        const screenY = cy + this.y * scale;

        // Don't draw if outside screen
        if (screenX < -50 || screenX > canvas.width + 50 || screenY < -50 || screenY > canvas.height + 50) {
          return;
        }

        // Size increases as star gets closer
        const scaledSize = this.size * scale;

        // Brightness increases as star gets closer
        const brightness = (1 - this.z / canvas.width) * this.opacity;

        // Draw star trail (warp effect)
        if (scale > 1.5) {
          const prevScale = canvas.width / (this.z + this.speed * 4);
          const prevX = cx + this.x * prevScale;
          const prevY = cy + this.y * prevScale;

          const gradient = ctx.createLinearGradient(prevX, prevY, screenX, screenY);
          gradient.addColorStop(0, `rgba(${this.color}, 0)`);
          gradient.addColorStop(1, `rgba(${this.color}, ${brightness * 0.7})`);

          ctx.beginPath();
          ctx.moveTo(prevX, prevY);
          ctx.lineTo(screenX, screenY);
          ctx.strokeStyle = gradient;
          ctx.lineWidth = scaledSize * 0.6;
          ctx.stroke();
        }

        // Draw star
        ctx.beginPath();
        ctx.arc(screenX, screenY, scaledSize, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color}, ${brightness})`;
        ctx.fill();

        // Add glow for close stars
        if (scale > 2) {
          const glowGradient = ctx.createRadialGradient(
            screenX,
            screenY,
            0,
            screenX,
            screenY,
            scaledSize * 5
          );
          glowGradient.addColorStop(0, `rgba(${this.color}, ${brightness * 0.4})`);
          glowGradient.addColorStop(1, "rgba(255, 255, 255, 0)");
          ctx.fillStyle = glowGradient;
          ctx.fill();
        }
      }
    }

    // Nebula class
    class Nebula {
      x: number;
      y: number;
      radius: number;
      color: string;
      opacity: number;
      pulseSpeed: number;
      pulseOffset: number;
      rotationSpeed: number;
      rotation: number;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.radius = Math.random() * 350 + 250;
        const colors = [
          "rgba(147, 51, 234,", // Purple
          "rgba(59, 130, 246,", // Blue
          "rgba(16, 185, 129,", // Green
          "rgba(236, 72, 153,", // Pink
          "rgba(34, 211, 238,", // Cyan
          "rgba(251, 146, 60,", // Orange
        ];
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.opacity = Math.random() * 0.1 + 0.04;
        this.pulseSpeed = Math.random() * 0.002 + 0.0005;
        this.pulseOffset = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.0005;
        this.rotation = Math.random() * Math.PI * 2;
      }

      draw(time: number) {
        const pulse = Math.sin(time * this.pulseSpeed + this.pulseOffset) * 0.5 + 0.5;
        this.rotation += this.rotationSpeed;

        const gradient = ctx.createRadialGradient(
          this.x,
          this.y,
          0,
          this.x,
          this.y,
          this.radius
        );
        gradient.addColorStop(0, `${this.color} ${this.opacity * pulse})`);
        gradient.addColorStop(0.4, `${this.color} ${this.opacity * pulse * 0.5})`);
        gradient.addColorStop(1, `${this.color} 0)`);

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.translate(-this.x, -this.y);

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        ctx.restore();
      }
    }

    // Speed line class for extra warp effect
    class SpeedLine {
      angle: number;
      distance: number;
      speed: number;
      length: number;
      opacity: number;
      color: string;

      constructor() {
        this.reset();
      }

      reset() {
        this.angle = Math.random() * Math.PI * 2;
        this.distance = Math.random() * 200 + 100;
        this.speed = Math.random() * 20 + 10;
        this.length = Math.random() * 150 + 80;
        this.opacity = 0;

        const colors = [
          "rgba(147, 51, 234, ", // Purple
          "rgba(59, 130, 246, ",  // Blue
          "rgba(34, 211, 238, ",  // Cyan
          "rgba(236, 72, 153, ",  // Pink
        ];
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        this.distance += this.speed;
        this.opacity = Math.min(this.opacity + 0.03, 0.4);

        if (this.distance > Math.max(canvas.width, canvas.height) * 1.2) {
          this.reset();
          this.distance = 0;
          this.opacity = 0;
        }
      }

      draw() {
        const cx = centerX();
        const cy = centerY();
        const startX = cx + Math.cos(this.angle) * this.distance;
        const startY = cy + Math.sin(this.angle) * this.distance;
        const endX = cx + Math.cos(this.angle) * (this.distance + this.length);
        const endY = cy + Math.sin(this.angle) * (this.distance + this.length);

        const gradient = ctx.createLinearGradient(startX, startY, endX, endY);
        gradient.addColorStop(0, `${this.color}0)`);
        gradient.addColorStop(0.5, `${this.color}${this.opacity})`);
        gradient.addColorStop(1, `${this.color}0)`);

        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    }

    // Floating particle class
    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      color: string;
      twinkleSpeed: number;
      twinkleOffset: number;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1.5 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = (Math.random() - 0.5) * 0.3;
        this.opacity = Math.random() * 0.6 + 0.2;
        this.twinkleSpeed = Math.random() * 0.003 + 0.001;
        this.twinkleOffset = Math.random() * Math.PI * 2;

        const colors = [
          "rgba(255, 255, 255,",
          "rgba(147, 51, 234,",
          "rgba(59, 130, 246,",
          "rgba(34, 211, 238,",
        ];
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      update(time: number) {
        this.x += this.speedX;
        this.y += this.speedY;

        // Wrap around screen
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
      }

      draw(time: number) {
        const twinkle = Math.sin(time * this.twinkleSpeed + this.twinkleOffset) * 0.3 + 0.7;
        const currentOpacity = this.opacity * twinkle;

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `${this.color} ${currentOpacity})`;
        ctx.fill();

        // Add subtle glow
        const glow = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 3);
        glow.addColorStop(0, `${this.color} ${currentOpacity * 0.5})`);
        glow.addColorStop(1, `${this.color} 0)`);
        ctx.fillStyle = glow;
        ctx.fill();
      }
    }

    // Create stars and effects
    const stars = Array.from({ length: 300 }, () => new Star()); // More stars
    const nebulae = Array.from({ length: 8 }, () => new Nebula()); // More nebulae
    const speedLines = Array.from({ length: 25 }, () => new SpeedLine()); // More speed lines
    const particles = Array.from({ length: 100 }, () => new Particle()); // Floating particles

    // Animation loop
    const animate = (time: number) => {
      // Clear with slight trail effect
      ctx.fillStyle = "rgba(10, 10, 20, 0.2)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw nebulae (background layer)
      nebulae.forEach((nebula) => nebula.draw(time));

      // Draw particles (middle layer)
      particles.forEach((particle) => {
        particle.update(time);
        particle.draw(time);
      });

      // Draw speed lines
      speedLines.forEach((line) => {
        line.update();
        line.draw();
      });

      // Draw stars (front layer)
      stars.forEach((star) => {
        star.update();
        star.draw();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate(0);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0, background: "radial-gradient(ellipse at center, #0a0a14 0%, #000005 100%)" }}
    />
  );
}
