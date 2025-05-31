export interface VisualStimulus {
  id: string;
  type: 'flicker' | 'particle' | 'distortion' | 'overlay' | 'shake';
  intensity: number;
  color?: string;
  frequency?: number;
  size?: number;
  opacity?: number;
  speed?: number;
}

export interface VisualConfig {
  stimuli: VisualStimulus[];
  stressMultiplier: number;
  backgroundColor?: string;
}

class VisualEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private animationId: number | null = null;
  private stimuli: Map<string, VisualStimulus> = new Map();
  private stressLevel = 0;
  private isRunning = false;
  private particles: Particle[] = [];
  private time = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('Failed to get canvas context');
    }
    this.ctx = context;
    this.setupCanvas();
  }

  private setupCanvas(): void {
    const dpr = window.devicePixelRatio || 1;
    const rect = this.canvas.getBoundingClientRect();
    
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    
    this.ctx.scale(dpr, dpr);
    this.canvas.style.width = rect.width + 'px';
    this.canvas.style.height = rect.height + 'px';
  }

  start(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.animate();
  }

  stop(): void {
    this.isRunning = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  private animate = (): void => {
    if (!this.isRunning) return;
    
    this.time += 1;
    this.clear();
    this.renderStimuli();
    this.updateParticles();
    
    this.animationId = requestAnimationFrame(this.animate);
  };

  private clear(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  private renderStimuli(): void {
    this.stimuli.forEach((stimulus) => {
      switch (stimulus.type) {
        case 'flicker':
          this.renderFlicker(stimulus);
          break;
        case 'particle':
          this.renderParticles(stimulus);
          break;
        case 'distortion':
          this.renderDistortion(stimulus);
          break;
        case 'overlay':
          this.renderOverlay(stimulus);
          break;
        case 'shake':
          this.renderShake(stimulus);
          break;
      }
    });
  }

  private renderFlicker(stimulus: VisualStimulus): void {
    const intensity = stimulus.intensity * (1 + this.stressLevel);
    const frequency = stimulus.frequency || 10;
    const shouldFlicker = Math.sin(this.time * frequency * 0.1) > (1 - intensity);
    
    if (shouldFlicker) {
      this.ctx.fillStyle = stimulus.color || '#ffffff';
      this.ctx.globalAlpha = stimulus.opacity || 0.3;
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.globalAlpha = 1;
    }
  }

  private renderParticles(stimulus: VisualStimulus): void {
    const particleCount = Math.floor(stimulus.intensity * 20 * (1 + this.stressLevel));
    
    // Add new particles
    while (this.particles.length < particleCount) {
      this.particles.push(new Particle(this.canvas.width, this.canvas.height, stimulus));
    }

    // Remove excess particles
    while (this.particles.length > particleCount) {
      this.particles.pop();
    }

    // Update and render particles
    this.particles.forEach(particle => {
      particle.update();
      particle.render(this.ctx);
    });
  }

  private renderDistortion(stimulus: VisualStimulus): void {
    const intensity = stimulus.intensity * (1 + this.stressLevel * 2);
    
    // Create distortion effect using image data manipulation
    const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
      const distortion = Math.sin(this.time * 0.1 + i * 0.001) * intensity * 50;
      
      // Shift pixel positions
      const newIndex = Math.floor(i + distortion) * 4;
      if (newIndex >= 0 && newIndex < data.length - 4) {
        data[i] = data[newIndex]; // R
        data[i + 1] = data[newIndex + 1]; // G
        data[i + 2] = data[newIndex + 2]; // B
      }
    }
    
    this.ctx.putImageData(imageData, 0, 0);
  }

  private renderOverlay(stimulus: VisualStimulus): void {
    this.ctx.fillStyle = stimulus.color || '#ff0000';
    this.ctx.globalAlpha = (stimulus.opacity || 0.1) * (1 + this.stressLevel);
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.globalAlpha = 1;
  }

  private renderShake(stimulus: VisualStimulus): void {
    const intensity = stimulus.intensity * (1 + this.stressLevel * 2);
    const shakeX = (Math.random() - 0.5) * intensity * 10;
    const shakeY = (Math.random() - 0.5) * intensity * 10;
    
    this.ctx.save();
    this.ctx.translate(shakeX, shakeY);
    // Content will be rendered with shake offset
    this.ctx.restore();
  }

  private updateParticles(): void {
    this.particles = this.particles.filter(particle => !particle.isDead);
  }

  addStimulus(stimulus: VisualStimulus): void {
    this.stimuli.set(stimulus.id, stimulus);
  }

  removeStimulus(id: string): void {
    this.stimuli.delete(id);
  }

  updateStressLevel(level: number): void {
    this.stressLevel = Math.max(0, Math.min(1, level));
  }

  clearAllStimuli(): void {
    this.stimuli.clear();
    this.particles = [];
  }

  // Predefined visual configurations
  static getSensoryOverloadConfig(): VisualConfig {
    return {
      stressMultiplier: 1.5,
      backgroundColor: '#f0f0f0',
      stimuli: [
        {
          id: 'fluorescent_flicker',
          type: 'flicker',
          intensity: 0.6,
          frequency: 15,
          color: '#ffffff',
          opacity: 0.4
        },
        {
          id: 'visual_noise',
          type: 'particle',
          intensity: 0.8,
          color: '#333333',
          size: 2,
          speed: 3
        },
        {
          id: 'red_overlay',
          type: 'overlay',
          intensity: 0.3,
          color: '#ff4444',
          opacity: 0.1
        }
      ]
    };
  }

  static getCognitiveLoadConfig(): VisualConfig {
    return {
      stressMultiplier: 1.2,
      backgroundColor: '#e8e8e8',
      stimuli: [
        {
          id: 'mental_fog',
          type: 'overlay',
          intensity: 0.4,
          color: '#888888',
          opacity: 0.2
        },
        {
          id: 'distraction_particles',
          type: 'particle',
          intensity: 0.3,
          color: '#666666',
          size: 1,
          speed: 1
        }
      ]
    };
  }

  static getMeltdownConfig(): VisualConfig {
    return {
      stressMultiplier: 2.0,
      backgroundColor: '#400000',
      stimuli: [
        {
          id: 'overwhelming_flicker',
          type: 'flicker',
          intensity: 0.9,
          frequency: 25,
          color: '#ff0000',
          opacity: 0.6
        },
        {
          id: 'chaos_particles',
          type: 'particle',
          intensity: 1.0,
          color: '#ff6666',
          size: 4,
          speed: 8
        },
        {
          id: 'screen_shake',
          type: 'shake',
          intensity: 0.8
        },
        {
          id: 'distortion',
          type: 'distortion',
          intensity: 0.5
        }
      ]
    };
  }
}

class Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  life: number;
  maxLife: number;
  isDead = false;

  constructor(canvasWidth: number, canvasHeight: number, stimulus: VisualStimulus) {
    this.x = Math.random() * canvasWidth;
    this.y = Math.random() * canvasHeight;
    this.vx = (Math.random() - 0.5) * (stimulus.speed || 1);
    this.vy = (Math.random() - 0.5) * (stimulus.speed || 1);
    this.size = stimulus.size || 2;
    this.color = stimulus.color || '#333333';
    this.maxLife = 60 + Math.random() * 120;
    this.life = this.maxLife;
  }

  update(): void {
    this.x += this.vx;
    this.y += this.vy;
    this.life--;
    
    if (this.life <= 0) {
      this.isDead = true;
    }
  }

  render(ctx: CanvasRenderingContext2D): void {
    const alpha = this.life / this.maxLife;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

export default VisualEngine;
