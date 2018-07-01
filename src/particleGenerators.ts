import * as THREE from 'three';
import Particle from './Particle';
import Field from './Field';

export const grid = (field: Field, countX: number, countY: number, scaleX: number, scaleY: number) => {
  const stepX = scaleX / countX;
  const stepY = scaleY / countY;

  for (let indexX = 0; indexX < countX; indexX += 1) {
    for (let indexY = 0; indexY < countY; indexY += 1) {
      const particle = new Particle(new THREE.Vector2((indexX + 0.5) * stepX, (indexY + 0.5) * stepY));
      field.addParticle(particle);
    }
  }
};

export const random = (field: Field, count: number, scaleX: number, scaleY: number) => {
  for (let index = 0; index < count; index += 1) {
    const particle = new Particle(new THREE.Vector2(Math.random() * scaleX, Math.random() * scaleY));
    field.addParticle(particle);
  }
};
