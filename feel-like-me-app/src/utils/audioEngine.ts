import * as Tone from 'tone';

export interface AudioLayer {
  id: string;
  source: Tone.Oscillator | Tone.Player | Tone.Noise;
  gain: Tone.Gain;
  filter?: Tone.Filter;
  effects?: Tone.ToneAudioNode[];
}

export interface SoundscapeConfig {
  baseVolume: number;
  stressMultiplier: number;
  layers: {
    [key: string]: {
      type: 'oscillator' | 'noise' | 'sample';
      frequency?: number;
      volume: number;
      effects?: string[];
    };
  };
}

class AudioEngine {
  private layers: Map<string, AudioLayer> = new Map();
  private masterGain: Tone.Gain;
  private isInitialized = false;
  private stressLevel = 0;

  constructor() {
    this.masterGain = new Tone.Gain(0.7).toDestination();
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;
    
    try {
      await Tone.start();
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize audio engine:', error);
      throw error;
    }
  }

  createSoundscape(config: SoundscapeConfig): void {
    // Clear existing layers
    this.clearAllLayers();

    Object.entries(config.layers).forEach(([id, layerConfig]) => {
      this.addLayer(id, layerConfig);
    });
  }
  addLayer(id: string, config: any): void {
    let source: Tone.Oscillator | Tone.Player | Tone.Noise;
    
    switch (config.type) {
      case 'oscillator':
        source = new Tone.Oscillator({
          frequency: config.frequency || 440,
          type: 'sine'
        });
        break;
      case 'noise':
        source = new Tone.Noise('pink');
        break;
      case 'sample':
        source = new Tone.Player(config.url);
        break;
      default:
        throw new Error(`Unknown source type: ${config.type}`);
    }

    const gain = new Tone.Gain(config.volume);
    const filter = new Tone.Filter(1000, 'lowpass');

    // Create effect chain
    let chain: Tone.ToneAudioNode[] = [source];
    
    if (config.effects?.includes('distortion')) {
      const distortion = new Tone.Distortion(0.4);
      chain.push(distortion);
    }
    
    if (config.effects?.includes('reverb')) {
      const reverb = new Tone.Reverb(2);
      chain.push(reverb);
    }

    if (config.effects?.includes('delay')) {
      const delay = new Tone.Delay(0.2);
      chain.push(delay);
    }

    chain.push(filter, gain, this.masterGain);

    // Connect the chain
    for (let i = 0; i < chain.length - 1; i++) {
      chain[i].connect(chain[i + 1]);
    }

    const layer: AudioLayer = {
      id,
      source,
      gain,
      filter,
      effects: chain.slice(1, -2) // Remove source and master connections
    };

    this.layers.set(id, layer);
  }

  updateStressLevel(level: number): void {
    this.stressLevel = Math.max(0, Math.min(1, level));
    
    this.layers.forEach((layer) => {
      // Increase volume and add distortion as stress increases
      const stressGain = 1 + (this.stressLevel * 0.5);
      layer.gain.gain.rampTo(layer.gain.gain.value * stressGain, 0.1);
      
      // Modulate filter frequency with stress
      if (layer.filter) {
        const cutoff = 1000 + (this.stressLevel * 2000);
        layer.filter.frequency.rampTo(cutoff, 0.2);
      }
    });
  }
  startLayer(id: string): void {
    const layer = this.layers.get(id);
    if (layer && layer.source instanceof Tone.Oscillator) {
      layer.source.start();
    } else if (layer && layer.source instanceof Tone.Player) {
      layer.source.start();
    } else if (layer && layer.source instanceof Tone.Noise) {
      layer.source.start();
    }
  }

  stopLayer(id: string): void {
    const layer = this.layers.get(id);
    if (layer) {
      layer.source.stop();
    }
  }

  setLayerVolume(id: string, volume: number): void {
    const layer = this.layers.get(id);
    if (layer) {
      layer.gain.gain.rampTo(volume, 0.1);
    }
  }

  startAllLayers(): void {
    this.layers.forEach((_, id) => this.startLayer(id));
  }

  stopAllLayers(): void {
    this.layers.forEach((_, id) => this.stopLayer(id));
  }

  clearAllLayers(): void {
    this.layers.forEach((layer) => {
      layer.source.dispose();
      layer.gain.dispose();
      layer.filter?.dispose();
      layer.effects?.forEach(effect => effect.dispose());
    });
    this.layers.clear();
  }

  setMasterVolume(volume: number): void {
    this.masterGain.gain.rampTo(volume, 0.1);
  }

  // Predefined soundscapes for different modules
  static getSensoryOverloadConfig(): SoundscapeConfig {
    return {
      baseVolume: 0.6,
      stressMultiplier: 1.5,
      layers: {
        'crowd': {
          type: 'noise',
          volume: 0.4,
          effects: ['distortion']
        },
        'fluorescent': {
          type: 'oscillator',
          frequency: 120,
          volume: 0.2,
          effects: ['distortion']
        },
        'air_conditioner': {
          type: 'oscillator',
          frequency: 60,
          volume: 0.3
        },
        'traffic': {
          type: 'noise',
          volume: 0.5,
          effects: ['delay']
        }
      }
    };
  }

  static getCognitiveLoadConfig(): SoundscapeConfig {
    return {
      baseVolume: 0.4,
      stressMultiplier: 1.2,
      layers: {
        'mental_fog': {
          type: 'noise',
          volume: 0.3,
          effects: ['reverb']
        },
        'pressure': {
          type: 'oscillator',
          frequency: 40,
          volume: 0.2
        }
      }
    };
  }

  static getMeltdownConfig(): SoundscapeConfig {
    return {
      baseVolume: 0.8,
      stressMultiplier: 2.0,
      layers: {
        'overwhelming': {
          type: 'noise',
          volume: 0.7,
          effects: ['distortion', 'delay']
        },
        'heartbeat': {
          type: 'oscillator',
          frequency: 80,
          volume: 0.5
        },
        'chaos': {
          type: 'noise',
          volume: 0.6,
          effects: ['distortion', 'reverb']
        }
      }
    };
  }
}

export default AudioEngine;
