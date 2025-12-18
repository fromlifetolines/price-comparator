"use client";

import React, { useEffect, useRef } from 'react';

const FluidBackground = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        const particles: Particle[] = [];
        const particleCount = 100;

        // Mouse state
        let mouseX = 0;
        let mouseY = 0;
        let isMoving = false;
        let timeout: NodeJS.Timeout;

        const colors = [
            'rgba(59, 130, 246, 0.5)', // Blue
            'rgba(147, 51, 234, 0.5)', // Purple
            'rgba(236, 72, 153, 0.5)', // Pink
        ];

        class Particle {
            x: number;
            y: number;
            vx: number;
            vy: number;
            size: number;
            color: string;
            life: number;
            maxLife: number;

            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 2;
                this.vy = (Math.random() - 0.5) * 2;
                this.size = Math.random() * 150 + 50;
                this.color = colors[Math.floor(Math.random() * colors.length)];
                this.life = Math.random() * 100;
                this.maxLife = 100 + Math.random() * 100;
            }

            update() {
                // Natural movement
                this.x += this.vx;
                this.y += this.vy;

                // Mouse influence
                if (isMoving) {
                    const dx = mouseX - this.x;
                    const dy = mouseY - this.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 400) {
                        const force = (400 - dist) / 400;
                        this.vx += (dx / dist) * force * 0.5;
                        this.vy += (dy / dist) * force * 0.5;
                    }
                }

                // Friction
                this.vx *= 0.98;
                this.vy *= 0.98;

                // Wrap around
                if (this.x < -this.size) this.x = width + this.size;
                if (this.x > width + this.size) this.x = -this.size;
                if (this.y < -this.size) this.y = height + this.size;
                if (this.y > height + this.size) this.y = -this.size;

                this.life++;
            }

            draw() {
                if (!ctx) return;
                ctx.globalCompositeOperation = 'screen';
                ctx.beginPath();
                const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
                gradient.addColorStop(0, this.color);
                gradient.addColorStop(1, 'rgba(0,0,0,0)');
                ctx.fillStyle = gradient;
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        const init = () => {
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, width, height);

            // Draw dark background
            ctx.globalCompositeOperation = 'source-over';
            ctx.fillStyle = '#000000';
            ctx.fillRect(0, 0, width, height);

            particles.forEach(p => {
                p.update();
                p.draw();
            });

            requestAnimationFrame(animate);
        };

        const handleResize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };

        const handleMouseMove = (e: MouseEvent) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            isMoving = true;
            clearTimeout(timeout);
            timeout = setTimeout(() => isMoving = false, 1000);
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', handleMouseMove);

        init();
        animate();

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 z-0 pointer-events-none"
            style={{ background: '#000000' }}
        />
    );
};

export default FluidBackground;
