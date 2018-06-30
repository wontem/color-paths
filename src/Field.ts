import OpenSimplexNoise from 'open-simplex-noise';
import * as THREE from 'three';
import Particle from './Particle';

const fromPolar = (phi: number, length: number): THREE.Vector2 => {
  const x = length * Math.cos(phi);
  const y = length * Math.sin(phi);
  return new THREE.Vector2(x, y);
}

export default class Field {
  particles: Set<Particle>;
  noise: OpenSimplexNoise;
  step: number;

  constructor() {
    this.particles = new Set();
    this.noise = new OpenSimplexNoise(Date.now());
    this.step = 0;
  }

  addParticle(particle: Particle) {
    this.particles.add(particle);
    return this;
  }

  tick() {
    this.step += 1;
    for (const particle of this.particles) {
      const angle = this.noise.noise3D(particle.position.x / 100, particle.position.y / 100, this.step / 10);
      // particle.velocity = fromPolar(angle * Math.PI * 2, 2);
      particle.velocity.add(new THREE.Vector2(angle, -2));
      particle.tick();
    }
  }
}
