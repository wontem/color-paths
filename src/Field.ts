import Particle from './Particle';

export type Transform = (particle: Particle, step: number) => boolean;

export default class Field {
  particles: Set<Particle>;
  step: number;
  transform: Transform;

  constructor(transform: Transform) {
    this.particles = new Set();
    this.step = 0;
    this.transform = transform;
  }

  addParticle(particle: Particle): this {
    this.particles.add(particle);
    return this;
  }

  removeParticle(particle: Particle): this {
    this.particles.delete(particle);
    return this;
  }

  tick() {
    for (const particle of this.particles) {
      const keepAlive = this.transform(particle, this.step);
      if (keepAlive) {
        particle.position.add(particle.velocity);
        particle.age += 1;
      } else {
        this.removeParticle(particle);
      }
    }
    this.step += 1;
  }
}
